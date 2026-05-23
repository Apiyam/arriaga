import { supabaseClient } from "@/utility";

/** Tablas exportables con el cliente anon/authenticated (según RLS). */
export const BACKUP_TABLES = [
  "proceedings",
  "binnacles",
  "spendings",
  "audits",
  "history_proceedings",
  "proceeding_files",
  "user_accounts",
  "user_information",
  "user_roles",
  "meeting_catalogs",
  "exhort_catalogs",
  "process_state_catalogs",
  "lic_catalogs",
  "app_settings",
] as const;

export type BackupPayload = {
  exported_at: string;
  project_url: string;
  tables: Record<string, { rows: unknown[]; error?: string }>;
};

export async function exportDatabaseBackup(
  onProgress?: (table: string, index: number, total: number) => void
): Promise<BackupPayload> {
  const payload: BackupPayload = {
    exported_at: new Date().toISOString(),
    project_url: import.meta.env.VITE_SUPABASE_URL || "",
    tables: {},
  };

  const total = BACKUP_TABLES.length;

  for (let i = 0; i < total; i++) {
    const table = BACKUP_TABLES[i];
    onProgress?.(table, i + 1, total);

    const { data, error } = await supabaseClient.from(table).select("*");
    if (error) {
      payload.tables[table] = { rows: [], error: error.message };
    } else {
      payload.tables[table] = { rows: data ?? [] };
    }
  }

  return payload;
}

export function downloadBackupJson(payload: BackupPayload): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `respaldo-arturo-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
