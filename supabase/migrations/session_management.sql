-- ============================================================
-- Session Management System
-- Tables: session_price_templates, session_packages,
--         session_transactions, session_payments
-- RPC:    deduct_session, refund_session
-- ============================================================

-- 0. Add base session price to professionals
ALTER TABLE pro.professionals
  ADD COLUMN IF NOT EXISTS session_price_cents int CHECK (session_price_cents >= 0);

-- 1. Session Price Templates (professional's price catalog)
CREATE TABLE IF NOT EXISTS pro.session_price_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'package' CHECK (type IN ('single', 'package')),
  session_count int NOT NULL CHECK (session_count >= 1 AND session_count <= 200),
  price_per_session_cents int NOT NULL CHECK (price_per_session_cents >= 0),
  total_price_cents int NOT NULL CHECK (total_price_cents >= 0),
  discount_percent int NOT NULL DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pro.session_price_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals manage own templates"
  ON pro.session_price_templates FOR ALL
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

CREATE INDEX idx_session_templates_pro
  ON pro.session_price_templates(professional_id) WHERE is_active = true;

-- 2. Session Packages (assigned to a client)
CREATE TABLE IF NOT EXISTS pro.session_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES pro.clients(id) ON DELETE CASCADE,
  template_id uuid REFERENCES pro.session_price_templates(id) ON DELETE SET NULL,
  name text NOT NULL,
  total_sessions int NOT NULL CHECK (total_sessions >= 1),
  remaining_sessions int NOT NULL CHECK (remaining_sessions >= 0),
  total_price_cents int NOT NULL CHECK (total_price_cents >= 0),
  currency text NOT NULL DEFAULT 'TRY',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pro.session_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals manage own packages"
  ON pro.session_packages FOR ALL
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

CREATE INDEX idx_session_packages_client
  ON pro.session_packages(client_id, status);

CREATE INDEX idx_session_packages_pro
  ON pro.session_packages(professional_id);

-- 3. Session Transactions (deductions & refunds ledger)
CREATE TABLE IF NOT EXISTS pro.session_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES pro.session_packages(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES pro.clients(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES pro.appointments(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('usage', 'refund', 'manual_deduct')),
  amount int NOT NULL,
  remaining_after int NOT NULL CHECK (remaining_after >= 0),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pro.session_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals manage own transactions"
  ON pro.session_transactions FOR ALL
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

CREATE INDEX idx_session_txn_appointment
  ON pro.session_transactions(appointment_id) WHERE appointment_id IS NOT NULL;

CREATE INDEX idx_session_txn_package
  ON pro.session_transactions(package_id);

-- 4. Session Payments (partial payment records)
CREATE TABLE IF NOT EXISTS pro.session_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES pro.session_packages(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents int NOT NULL CHECK (amount_cents > 0),
  method text CHECK (method IN ('cash', 'card', 'transfer', 'other')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pro.session_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals manage own payments"
  ON pro.session_payments FOR ALL
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

CREATE INDEX idx_session_payments_package
  ON pro.session_payments(package_id);

-- 5. Add session_transaction_id to appointments
ALTER TABLE pro.appointments
  ADD COLUMN IF NOT EXISTS session_transaction_id uuid
  REFERENCES pro.session_transactions(id) ON DELETE SET NULL;

-- ============================================================
-- RPC: Atomic session deduction (race-condition safe)
-- ============================================================
CREATE OR REPLACE FUNCTION pro.deduct_session(
  p_package_id uuid,
  p_appointment_id uuid,
  p_professional_id uuid,
  p_client_id uuid
) RETURNS int AS $$
DECLARE
  v_remaining int;
  v_txn_id uuid;
BEGIN
  -- Atomic decrement with row-level lock
  UPDATE pro.session_packages
  SET remaining_sessions = remaining_sessions - 1,
      status = CASE WHEN remaining_sessions - 1 = 0 THEN 'completed' ELSE status END,
      updated_at = now()
  WHERE id = p_package_id
    AND remaining_sessions > 0
    AND status = 'active'
    AND professional_id = p_professional_id
  RETURNING remaining_sessions INTO v_remaining;

  IF v_remaining IS NULL THEN
    RETURN -1;
  END IF;

  INSERT INTO pro.session_transactions
    (package_id, professional_id, client_id, appointment_id, type, amount, remaining_after)
  VALUES
    (p_package_id, p_professional_id, p_client_id, p_appointment_id, 'usage', -1, v_remaining)
  RETURNING id INTO v_txn_id;

  -- Link the transaction to the appointment
  IF p_appointment_id IS NOT NULL THEN
    UPDATE pro.appointments
    SET session_transaction_id = v_txn_id
    WHERE id = p_appointment_id AND professional_id = p_professional_id;
  END IF;

  RETURN v_remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC: Atomic session refund (double-refund safe)
-- ============================================================
CREATE OR REPLACE FUNCTION pro.refund_session(
  p_appointment_id uuid,
  p_professional_id uuid
) RETURNS int AS $$
DECLARE
  v_usage_txn RECORD;
  v_existing_refund int;
  v_remaining int;
  v_txn_id uuid;
BEGIN
  -- Find the usage transaction for this appointment
  SELECT st.id, st.package_id, st.client_id
  INTO v_usage_txn
  FROM pro.session_transactions st
  WHERE st.appointment_id = p_appointment_id
    AND st.type = 'usage'
    AND st.professional_id = p_professional_id
  LIMIT 1;

  IF v_usage_txn IS NULL THEN
    RETURN -1; -- no deduction was made
  END IF;

  -- Check for existing refund (double-refund protection)
  SELECT COUNT(*) INTO v_existing_refund
  FROM pro.session_transactions
  WHERE appointment_id = p_appointment_id
    AND type = 'refund'
    AND professional_id = p_professional_id;

  IF v_existing_refund > 0 THEN
    RETURN -2; -- already refunded
  END IF;

  -- Atomic increment
  UPDATE pro.session_packages
  SET remaining_sessions = remaining_sessions + 1,
      status = 'active',
      updated_at = now()
  WHERE id = v_usage_txn.package_id
    AND professional_id = p_professional_id
  RETURNING remaining_sessions INTO v_remaining;

  IF v_remaining IS NULL THEN
    RETURN -3; -- package not found
  END IF;

  INSERT INTO pro.session_transactions
    (package_id, professional_id, client_id, appointment_id, type, amount, remaining_after)
  VALUES
    (v_usage_txn.package_id, p_professional_id, v_usage_txn.client_id, p_appointment_id, 'refund', 1, v_remaining)
  RETURNING id INTO v_txn_id;

  -- Unlink from appointment
  UPDATE pro.appointments
  SET session_transaction_id = NULL
  WHERE id = p_appointment_id AND professional_id = p_professional_id;

  RETURN v_remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
