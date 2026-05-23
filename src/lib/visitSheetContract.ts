import { supabaseClient } from "@/utility";

export const VISIT_SHEET_CONTRACT_KEY = "visit_sheet_contract";

export const DEFAULT_VISIT_SHEET_CONTRACT =
  "Por este medio, contrato con usted la prestación de sus servicios profesionales a fin de que efectúe, " +
  "elabore la demanda y/o proseguir la demanda ya iniciada y obtener la liquidación o defensa de mis " +
  "derechos que conforme a las leyes me corresponde de mis patrones que adelante se mencionan con motivo " +
  "del despido y separación de mi empleo al servicio de ellos y las demás prestaciones que me correspondan.";

export async function getVisitSheetContract(): Promise<string> {
  const { data, error } = await supabaseClient
    .from("app_settings")
    .select("value")
    .eq("key", VISIT_SHEET_CONTRACT_KEY)
    .maybeSingle();

  if (error) {
    console.warn("No se pudo cargar el contrato (¿ejecutaste la migración app_settings?):", error.message);
    return DEFAULT_VISIT_SHEET_CONTRACT;
  }
  const text = data?.value?.trim();
  return text || DEFAULT_VISIT_SHEET_CONTRACT;
}

export async function saveVisitSheetContract(text: string): Promise<void> {
  const value = text.trim();
  if (!value) throw new Error("El texto del contrato no puede estar vacío.");

  const { error } = await supabaseClient.from("app_settings").upsert(
    {
      key: VISIT_SHEET_CONTRACT_KEY,
      value,
      description: "Texto del contrato en la hoja de visita (impresión)",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) throw error;
}
