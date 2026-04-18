#!/usr/bin/env python3
"""
Orbiramind E2E Test — 3 Gerçekçi Danışan
Mert (stresli yönetici) · Zeynep (genç, kariyer krizi) · Haluk (emeklilik öncesi, yalnız)
"""

import json, time, urllib.request, urllib.error, sys

BASE = "https://www.orbiramind.com"

# ─────────────────────────────────────────────
# PERSONA TANIMLARI
# ─────────────────────────────────────────────

PERSONAS = [
    {
        "name": "Mert Karagöz",
        "token": "Y9PYUA84",
        "desc": "38 yaşında, üst düzey yönetici, kronik stres, uyku sorunu, iş-yaşam dengesi kötü",
        "profile": {
            "gender": "male",
            "age_range": "26_40",
            "relationship_status": "married",
            "height": 180,
            "weight": 88,
            "children_status": "2_plus_children",
            "youngest_child_age": "school_age",
            "chronic_condition": False,
            "disability_status": False,
            "smoking_status": "social",
            "caffeine_intake": "high",
            "water_intake": "low",
            "alcohol_frequency": "occasional",
            "living_situation": "with_children",
            "caregiving_responsibility": "childcare",
            "work_school_status": "working",
            "nutrition_preference": "omnivore",
            "leisure_activities": ["streaming", "socializing"],
            "relaxing_activity": "streaming",
            "energy_source": "slightly_drains",
            "learning_style": "logical",
            "decision_style": "analytical",
            "problem_solving_style": "action",
            "peak_time": "late_morning",
            "routine_preference": "prefer_routine",
            "digital_platforms": ["social_media", "news", "youtube"],
            "core_values": ["career", "security", "family"],
            "motivation_source": "achievement",
            "stress_response": "fight",
            "social_role": "leader",
            "time_orientation": "medium_term",
            "emotional_expression": "suppress",
            "life_phase": "idare",
            "recent_changes": ["yok"],
        },
        "core_answers": {
            "sleep_quality": 2,
            "energy_level": 3,
            "stress_management": 2,
            "emotional_balance": 2,
            "focus": 3,
            "daily_load": 2,
            "routine_maintenance": 3,
            "personal_time": 2,
            "physical_wellbeing": 3,
            "nutrition_balance": 2,
            "support_access": 3,
            "relationship_quality": 3,
            "social_connection": 3,
            "communication_satisfaction": 3,
            "work_life_balance": 2,
            "family_relationship_quality": 3,
            "financial_stability_perception": 4,
            "life_satisfaction": 3,
            "resilience": 3,
            "physical_activity_level": 2,
            "digital_screen_impact": 2,
            "daily_motivation": 3,
            "hobby_engagement": 2,
            "perfectionism_pressure": 4,
        },
        # Deep dive sorulara persona'ya özgü otomatik cevaplar
        "deep_dive_hints": {
            "scale": 2,          # Genel olarak düşük skorlar (sorunlu alan)
            "stress": 2,          # Yüksek stres
            "work": 2,
            "sleep": 2,
            "social": 3,
            "single_choice_stress_duration": "more_than_year",
            "single_choice_resilience_source": "work_purpose",
            "single_choice_previous_episodes": 4,
            "single_choice_duration": 4,
            "single_choice_trigger": 1,
            "single_choice_worst_time": 7,
        },
    },
    {
        "name": "Zeynep Arslan",
        "token": "M455E4QF",
        "desc": "23 yaşında, yeni mezun, sosyal kaygı, kariyer belirsizliği, özgüven sorunu",
        "profile": {
            "gender": "female",
            "age_range": "18_26",
            "relationship_status": "single",
            "height": 165,
            "weight": 57,
            "children_status": "no_children",
            "chronic_condition": False,
            "disability_status": False,
            "smoking_status": "no",
            "caffeine_intake": "medium",
            "water_intake": "medium",
            "alcohol_frequency": "rare",
            "living_situation": "alone",
            "caregiving_responsibility": "no",
            "work_school_status": "job_seeking",
            "nutrition_preference": "vegetarian",
            "leisure_activities": ["reading", "sports", "social_media"],
            "relaxing_activity": "reading",
            "energy_source": "slightly_drains",
            "learning_style": "intuitive",
            "decision_style": "consultative",
            "problem_solving_style": "analysis",
            "peak_time": "afternoon",
            "routine_preference": "prefer_routine",
            "digital_platforms": ["social_media", "netflix", "spotify"],
            "core_values": ["growth", "freedom", "health"],
            "motivation_source": "learning",
            "stress_response": "freeze",
            "social_role": "observer",
            "time_orientation": "short_term",
            "emotional_expression": "written",
            "life_phase": "kriz",
            "recent_changes": ["mezuniyet"],
        },
        "core_answers": {
            "sleep_quality": 3,
            "energy_level": 4,
            "stress_management": 3,
            "emotional_balance": 2,
            "focus": 3,
            "daily_load": 3,
            "routine_maintenance": 3,
            "personal_time": 4,
            "physical_wellbeing": 4,
            "nutrition_balance": 4,
            "support_access": 3,
            "relationship_quality": 3,
            "social_connection": 2,
            "communication_satisfaction": 3,
            "work_life_balance": 4,
            "family_relationship_quality": 3,
            "financial_stability_perception": 2,
            "life_satisfaction": 3,
            "resilience": 3,
            "physical_activity_level": 4,
            "digital_screen_impact": 3,
            "daily_motivation": 3,
            "hobby_engagement": 3,
            "perfectionism_pressure": 4,
        },
        "deep_dive_hints": {
            "scale": 3,
            "stress": 3,
            "work": 3,
            "sleep": 3,
            "social": 2,
            "single_choice_stress_duration": "3_6_months",
            "single_choice_resilience_source": "family_friends",
            "single_choice_previous_episodes": 2,
            "single_choice_duration": 3,
            "single_choice_trigger": 1,
            "single_choice_worst_time": 3,
        },
    },
    {
        "name": "Haluk Çelik",
        "token": "GMEQUN6B",
        "desc": "57 yaşında, emeklilik öncesi, dul, yalnız, kronik hastalık (hipertansiyon), anlam krizi",
        "profile": {
            "gender": "male",
            "age_range": "55_plus",
            "relationship_status": "widowed",
            "height": 173,
            "weight": 83,
            "children_status": "2_plus_children",
            "youngest_child_age": "adult",
            "chronic_condition": True,
            "disability_status": False,
            "smoking_status": "social",
            "caffeine_intake": "low",
            "water_intake": "medium",
            "alcohol_frequency": "none",
            "living_situation": "alone",
            "caregiving_responsibility": "no",
            "work_school_status": "working",
            "nutrition_preference": "omnivore",
            "leisure_activities": ["reading", "streaming"],
            "relaxing_activity": "nature",
            "energy_source": "slightly_drains",
            "learning_style": "logical",
            "decision_style": "analytical",
            "problem_solving_style": "wait",
            "peak_time": "early_morning",
            "routine_preference": "prefer_routine",
            "digital_platforms": ["news", "youtube", "ebooks"],
            "core_values": ["family", "security", "peace"],
            "motivation_source": "helping",
            "stress_response": "suppress",
            "social_role": "observer",
            "time_orientation": "present",
            "emotional_expression": "suppress",
            "life_phase": "idare",
            "recent_changes": ["yok"],
        },
        "core_answers": {
            "sleep_quality": 3,
            "energy_level": 2,
            "stress_management": 3,
            "emotional_balance": 3,
            "focus": 3,
            "daily_load": 3,
            "routine_maintenance": 3,
            "personal_time": 4,
            "physical_wellbeing": 2,
            "nutrition_balance": 3,
            "support_access": 2,
            "relationship_quality": 2,
            "social_connection": 2,
            "communication_satisfaction": 3,
            "work_life_balance": 4,
            "family_relationship_quality": 4,
            "financial_stability_perception": 4,
            "life_satisfaction": 3,
            "resilience": 3,
            "physical_activity_level": 2,
            "digital_screen_impact": 2,
            "daily_motivation": 2,
            "hobby_engagement": 2,
            "perfectionism_pressure": 2,
        },
        "deep_dive_hints": {
            "scale": 2,
            "stress": 3,
            "work": 3,
            "sleep": 3,
            "social": 2,
            "single_choice_stress_duration": "more_than_year",
            "single_choice_resilience_source": "multiple",
            "single_choice_previous_episodes": 3,
            "single_choice_duration": 5,
            "single_choice_trigger": 3,
            "single_choice_worst_time": 4,
        },
    },
]


# ─────────────────────────────────────────────
# HTTP YARDIMCILARI
# ─────────────────────────────────────────────

def post(url, payload, headers=None):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise RuntimeError(f"HTTP {e.code}: {body}")


def get(url, headers=None):
    req = urllib.request.Request(url, method="GET")
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())


# ─────────────────────────────────────────────
# DEEP DIVE CEVAP ÜRETECİ
# ─────────────────────────────────────────────

def generate_deep_dive_answers(questions, hints):
    """Persona hints'e göre deep dive sorularına organik cevaplar üretir."""
    answers = {}
    for q in questions:
        qid = q["id"]
        qtype = q.get("answer_type", "scale")

        if qtype == "scale":
            # Pool bazlı özelleştirme
            pool = q.get("pool", "")
            if "stress" in pool:
                val = hints["stress"]
            elif "sleep" in pool or "fatigue" in pool:
                val = hints["sleep"]
            elif "work" in pool or "career" in pool:
                val = hints["work"]
            elif "social" in pool or "intimacy" in pool or "relationship" in pool:
                val = hints["social"]
            else:
                val = hints["scale"]
            answers[qid] = val

        elif qtype == "single_choice":
            opts = q.get("options", [])
            if not opts:
                answers[qid] = 3
                continue

            # Belirli sorular için özelleştirilmiş cevaplar
            if "duration" in qid and "stress" in qid:
                target = hints["single_choice_stress_duration"]
                match = next((o for o in opts if o["value"] == target), None)
                answers[qid] = match["value"] if match else opts[len(opts)//2]["value"]
            elif "resilience_source" in qid or "resilience" in qid and "source" in qid:
                target = hints["single_choice_resilience_source"]
                match = next((o for o in opts if o["value"] == target), None)
                answers[qid] = match["value"] if match else opts[0]["value"]
            elif "previous_episodes" in qid:
                target = hints["single_choice_previous_episodes"]
                match = next((o for o in opts if o["value"] == target), None)
                answers[qid] = match["value"] if match else opts[len(opts)//2]["value"]
            elif "duration_anchor" in qid or ("duration" in qid and "anchor" in qid):
                target = hints["single_choice_duration"]
                match = next((o for o in opts if o["value"] == target), None)
                answers[qid] = match["value"] if match else opts[len(opts)//2]["value"]
            elif "trigger" in qid:
                target = hints["single_choice_trigger"]
                match = next((o for o in opts if o["value"] == target), None)
                answers[qid] = match["value"] if match else opts[0]["value"]
            elif "worst_time" in qid:
                target = hints["single_choice_worst_time"]
                match = next((o for o in opts if o["value"] == target), None)
                answers[qid] = match["value"] if match else opts[3]["value"]
            else:
                # Genel: orta seçenek
                mid = len(opts) // 2
                answers[qid] = opts[mid]["value"]

        elif qtype == "multi_select":
            opts = q.get("options", [])
            # İlk 2 seçeneği al
            answers[qid] = [o["value"] for o in opts[:2]] if len(opts) >= 2 else [opts[0]["value"]]

        elif qtype == "text":
            # Persona'ya uygun metin cevaplar
            answers[qid] = "Bu konuda zorluklar yaşıyorum ama üstesinden gelmeye çalışıyorum."

        else:
            # Fallback: numeric 3
            answers[qid] = 3

    return answers


# ─────────────────────────────────────────────
# ANA TEST AKIŞI
# ─────────────────────────────────────────────

def run_persona_test(persona):
    name = persona["name"]
    token = persona["token"]
    print(f"\n{'='*60}")
    print(f"  {name} ({token})")
    print(f"  {persona['desc']}")
    print(f"{'='*60}")

    auth_headers = {"x-test-token": token}

    # ── ADIM 1: Session oluştur ──────────────────────────────────
    print(f"\n[1/4] Session oluşturuluyor...")
    raw = post(f"{BASE}/api/engine/session", {}, auth_headers)
    session_resp = raw.get("data", raw)  # Unwrap {"ok":true,"data":{...}}
    session_id = session_resp["session_id"]
    core_q_count = len(session_resp.get("core_questions", []))
    print(f"      ✓ session_id: {session_id}")
    print(f"      ✓ core_questions: {core_q_count} adet")

    # ── ADIM 2: Profil + Core Answers ───────────────────────────
    print(f"\n[2/4] Profil ve core cevaplar gönderiliyor...")
    raw2 = post(
        f"{BASE}/api/engine/answers",
        {
            "session_id": session_id,
            "profile": persona["profile"],
            "core_answers": persona["core_answers"],
        },
        auth_headers,
    )
    answers_resp = raw2.get("data", raw2)
    deep_questions = answers_resp.get("deep_dive_questions", [])
    routing = answers_resp.get("routing_summary", {})
    print(f"      ✓ Status: {answers_resp.get('session_status')}")
    print(f"      ✓ Deep dive sorular: {len(deep_questions)} adet")
    print(f"      ✓ Tetiklenen pool'lar: {routing.get('open_pools', [])}")

    # ── ADIM 3: Deep Dive Cevapları ─────────────────────────────
    print(f"\n[3/4] Deep dive cevaplar üretiliyor ve gönderiliyor...")
    deep_answers = generate_deep_dive_answers(deep_questions, persona["deep_dive_hints"])
    print(f"      ✓ {len(deep_answers)} cevap hazırlandı")
    for qid, val in list(deep_answers.items())[:5]:
        print(f"         {qid}: {val}")
    if len(deep_answers) > 5:
        print(f"         ... ve {len(deep_answers) - 5} cevap daha")

    # ── ADIM 4: Test Complete ────────────────────────────────────
    print(f"\n[4/4] Test tamamlanıyor (rapor üretimi başlatılıyor)...")
    complete_resp = post(
        f"{BASE}/api/test/complete",
        {
            "token": token,
            "session_id": session_id,
            "deep_dive_answers": deep_answers,
        },
    )
    print(f"      ✓ Status: {complete_resp.get('status')}")
    print(f"      ✓ Rapor arka planda üretiliyor...")

    return {"name": name, "token": token, "session_id": session_id}


def poll_reports(sessions):
    """Tüm oturumlar için raporları bekle."""
    print(f"\n\n{'='*60}")
    print("  RAPORLAR BEKLENİYOR (60-150 saniye)")
    print(f"{'='*60}")

    from supabase_poll import poll_all  # Inline tanımlayacağız
    pass


# ─────────────────────────────────────────────
# RAPOR POLLING — Supabase MCP yerine DB sorgulama
# ─────────────────────────────────────────────

def wait_for_all_reports(sessions, max_wait=180, poll_interval=10):
    """pro.test_invitations tablosunu polling ile kontrol et."""
    print(f"\n{'='*60}")
    print("  RAPORLAR BEKLENİYOR...")
    print(f"{'='*60}")

    pending = {s["token"]: s for s in sessions}
    completed = {}
    elapsed = 0

    while pending and elapsed < max_wait:
        time.sleep(poll_interval)
        elapsed += poll_interval
        print(f"\n  [{elapsed}s] {len(pending)} rapor bekleniyor...")

        for token in list(pending.keys()):
            try:
                # Doğrudan engine API'ye sor
                sess = pending[token]
                resp = get(
                    f"https://lblhkvwxhcdluhkjcmrx.supabase.co/rest/v1/test_invitations?token=eq.{token}&select=status,results_snapshot",
                    headers={
                        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibGhrdnd4aGNkbHVoa2pjbXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTgxOTksImV4cCI6MjA1OTI3NDE5OX0.2m-X8frmhEbp8KIruqlthK-LGlxQvXWBcNtKbnVYPlw",
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibGhrdnd4aGNkbHVoa2pjbXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTgxOTksImV4cCI6MjA1OTI3NDE5OX0.2m-X8frmhEbp8KIruqlthK-LGlxQvXWBcNtKbnVYPlw",
                        "Accept-Profile": "pro",
                    },
                )
                if resp and len(resp) > 0:
                    status = resp[0]["status"]
                    print(f"     {token}: {status}")
                    if status in ("completed", "error"):
                        completed[token] = {**sess, "status": status, "snapshot": resp[0].get("results_snapshot")}
                        del pending[token]
            except Exception as e:
                print(f"     {token}: poll hatası — {e}")

    # Kalan pending'leri de ekle
    for token, sess in pending.items():
        completed[token] = {**sess, "status": "timeout", "snapshot": None}

    return completed


# ─────────────────────────────────────────────
# RAPOR ANALİZİ
# ─────────────────────────────────────────────

def analyze_report(token, data):
    name = data["name"]
    status = data["status"]
    snapshot = data.get("snapshot")

    print(f"\n{'─'*60}")
    print(f"  RAPOR: {name} ({token})")
    print(f"  Status: {status.upper()}")
    print(f"{'─'*60}")

    if status == "timeout":
        print("  ⏳ TIMEOUT — Rapor 3 dakika içinde tamamlanmadı.")
        return

    if status == "error":
        print("  ❌ HATA — Rapor üretimi başarısız.")
        if snapshot:
            print(f"  Snapshot: {json.dumps(snapshot, ensure_ascii=False, indent=2)[:500]}")
        return

    if not snapshot:
        print("  ⚠️  Snapshot boş.")
        return

    report = snapshot.get("report", {})
    if not report or "error" in report:
        print(f"  ❌ Report içeriği geçersiz: {report}")
        return

    char_analysis = report.get("character_analysis", "")
    top5_weak5 = report.get("top5_and_weak5", {})
    coaching = report.get("coaching_roadmap", {})

    print(f"\n  📊 KARAKTER ANALİZİ ({len(char_analysis)} karakter):")
    print(f"  {'─'*50}")
    # İlk 600 karakteri göster
    preview = char_analysis[:600].strip()
    for line in preview.split("\n"):
        print(f"  {line}")
    if len(char_analysis) > 600:
        print(f"  ... ({len(char_analysis) - 600} karakter daha)")

    top5 = top5_weak5.get("top5", [])
    weak5 = top5_weak5.get("weak5", [])

    print(f"\n  💪 GÜÇLÜ ALANLAR (top5):")
    for i, item in enumerate(top5, 1):
        insight_preview = item.get("insight", "")[:100]
        print(f"    {i}. {item.get('name', '?')}: {insight_preview}...")

    print(f"\n  ⚠️  KIRIGAN ALANLAR (weak5):")
    for i, item in enumerate(weak5, 1):
        insight_preview = item.get("insight", "")[:100]
        print(f"    {i}. {item.get('name', '?')}: {insight_preview}...")

    if coaching:
        phases = coaching.get("phases", [])
        print(f"\n  🗺️  KOÇ YOL HARİTASI ({len(phases)} faz):")
        for phase in phases:
            print(f"    Faz {phase.get('phase_number', '?')}: {phase.get('title', '?')} ({phase.get('duration_weeks', '?')} hafta)")

    # Tutarlılık kontrolü
    print(f"\n  🔍 TUTARLILIK ANALİZİ:")
    issues = []
    warnings = []

    if len(char_analysis) < 800:
        issues.append(f"Karakter analizi çok kısa ({len(char_analysis)} karakter, min 1000 bekleniyor)")

    if len(top5) < 5:
        issues.append(f"Top5 eksik: {len(top5)}/5 alan var")

    if len(weak5) < 5:
        issues.append(f"Weak5 eksik: {len(weak5)}/5 alan var")

    for item in top5 + weak5:
        insight = item.get("insight", "")
        if len(insight) < 80:
            warnings.append(f"'{item.get('name')}' insight'ı çok kısa ({len(insight)} karakter)")

    if not coaching or not phases:
        issues.append("Koçluk yol haritası eksik veya boş")

    if issues:
        print(f"  ❌ SORUNLAR:")
        for issue in issues:
            print(f"     - {issue}")
    if warnings:
        print(f"  ⚠️  UYARILAR:")
        for w in warnings:
            print(f"     - {w}")
    if not issues and not warnings:
        print(f"  ✅ Yapısal kontroller geçti — rapor tutarlı görünüyor.")


# ─────────────────────────────────────────────
# ENTRYPOINT
# ─────────────────────────────────────────────

def poll_single_report(token, session_id, name, max_wait=240, poll_interval=12):
    """Tek bir rapor için polling yapar — Supabase REST API bypass ile."""
    print(f"\n  [{token}] Rapor bekleniyor (max {max_wait}s)...")
    elapsed = 0
    
    # Supabase REST endpoint ile anon key üzerinden sorgula
    import urllib.request, urllib.error
    SUPABASE_REST = "https://lblhkvwxhcdluhkjcmrx.supabase.co/rest/v1"
    # Anon key — sadece okuma, RLS açık
    ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibGhrdnd4aGNkbHVoa2pjbXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTgxOTksImV4cCI6MjA1OTI3NDE5OX0.2m-X8frmhEbp8KIruqlthK-LGlxQvXWBcNtKbnVYPlw"
    
    # Engine session'ı direkt sorgula (RLS bypass için service role gerekir)
    # Bunun yerine orbiramind API üzerinden polling yapalım
    # orbiramind'da test_invitations RLS anon read açık
    
    while elapsed < max_wait:
        time.sleep(poll_interval)
        elapsed += poll_interval
        
        try:
            req = urllib.request.Request(
                f"{SUPABASE_REST}/test_invitations?token=eq.{token}&select=status,results_snapshot",
                method="GET"
            )
            req.add_header("apikey", ANON_KEY)
            req.add_header("Authorization", f"Bearer {ANON_KEY}")
            req.add_header("Accept-Profile", "pro")
            
            with urllib.request.urlopen(req, timeout=15) as resp:
                rows = json.loads(resp.read())
                if rows:
                    status = rows[0]["status"]
                    snap = rows[0].get("results_snapshot")
                    print(f"  [{elapsed}s] {token}: {status}")
                    if status in ("completed", "error"):
                        return {"name": name, "token": token, "session_id": session_id, "status": status, "snapshot": snap}
        except Exception as e:
            print(f"  [{elapsed}s] {token}: poll hatası — {e}")
    
    return {"name": name, "token": token, "session_id": session_id, "status": "timeout", "snapshot": None}


if __name__ == "__main__":
    print("\n" + "="*60)
    print("  ORBIRAMIND E2E TEST — 3 DANIŞAN (SIRAYLA)")
    print("="*60)
    print("  Her danışan bağımsız çalışır — rapor beklenip sonra devam edilir")
    print("  Bu şekilde Anthropic API rate limit ve edge function timeout'u engellenir")
    print("="*60)

    all_results = {}
    
    for persona in PERSONAS:
        try:
            result = run_persona_test(persona)
            print(f"\n  ⏳ {result['name']} raporu üretilirken bekleniyor (~2-3 dk)...")
            
            # Rapor tamamlanana kadar bekle
            report_data = poll_single_report(
                result["token"], result["session_id"], result["name"],
                max_wait=240, poll_interval=10
            )
            all_results[result["token"]] = report_data
            
        except Exception as e:
            print(f"\n  ❌ {persona['name']} testi başarısız: {e}")
            all_results[persona["token"]] = {
                "name": persona["name"], "token": persona["token"],
                "session_id": None, "status": "failed", "snapshot": None
            }
        
        # Bir sonraki persona öncesi kısa ara (rate limit için)
        if persona != PERSONAS[-1]:
            print(f"\n  ⏸  Bir sonraki teste geçiliyor (5s bekleniyor)...")
            time.sleep(5)

    # Raporları analiz et
    print(f"\n\n{'='*60}")
    print("  TÜM RAPORLARIN DERİN ANALİZİ")
    print(f"{'='*60}")

    for token, data in all_results.items():
        analyze_report(token, data)

    print(f"\n\n{'='*60}")
    print("  TEST TAMAMLANDI")
    print(f"{'='*60}\n")
