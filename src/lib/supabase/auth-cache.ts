import { cache } from "react";
import { createClient } from "./server";

/**
 * React cache() ile aynı render ağacındaki tekrarlı getUser()
 * çağrılarını deduplicate eder — layout + dashboard page gibi
 * birden fazla Server Component aynı isteği paylaşır.
 */
export const getServerUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
});
