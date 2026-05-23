import { createClient } from "@refinedev/supabase";

const SUPABASE_URL = "https://ktmwjruqiwhnhrltmrwb.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bXdqcnVxaXdobmhybHRtcndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MzAzNzgsImV4cCI6MjA4MjEwNjM3OH0.eTLcuMCipKeGraBlu2sCuyVXgxox0zQnt__CCSjiC7A";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});

export const createRecord = async (table: string, data: any) => {
  const { data: newRecord, error } = await supabaseClient.from(table).insert(data).select().single();
  if(error) {
    throw error;
  }
  return newRecord;
}