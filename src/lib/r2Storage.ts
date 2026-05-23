/**
 * Cloudflare R2 desde el navegador (Refine/Vite).
 * Endpoint S3: https://<ACCOUNT_ID>.r2.cloudflarestorage.com  Bucket: arturo-arriaga
 *
 * IMPORTANTE: VITE_* se inyecta en el bundle público. Cualquiera puede ver las claves R2
 * en las herramientas de desarrollo. Úsalo solo en entornos de confianza o demos;
 * en producción serio, las claves deben quedar solo en backend (Edge Function, Worker, etc.).
 *
 * CORS del bucket (obligatorio para subir/borrar desde el navegador):
 * AllowedOrigins: tu origen (p. ej. http://localhost:5173)
 * AllowedMethods: GET, PUT, HEAD, DELETE
 * AllowedHeaders: *
 */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { supabaseClient } from "@/utility";

function r2Endpoint(): string {
  const custom = import.meta.env.VITE_R2_ENDPOINT?.trim();
  if (custom) return custom.replace(/\/$/, "");
  const accountId = import.meta.env.VITE_R2_ACCOUNT_ID;
  if (!accountId) {
    throw new Error("Configura VITE_R2_ACCOUNT_ID o VITE_R2_ENDPOINT en .env.");
  }
  return `https://${accountId}.r2.cloudflarestorage.com`;
}

function r2Client(): S3Client {
  const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "Configura en .env: VITE_R2_ACCESS_KEY_ID y VITE_R2_SECRET_ACCESS_KEY (y VITE_R2_ACCOUNT_ID o VITE_R2_ENDPOINT)."
    );
  }
  return new S3Client({
    region: "auto",
    endpoint: r2Endpoint(),
    credentials: { accessKeyId, secretAccessKey },
    // Evita checksums automáticos que rompen PUT firmados desde fetch en el navegador (AWS SDK ≥3.729).
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

function r2Bucket(): string {
  return import.meta.env.VITE_R2_BUCKET || "arturo-arriaga";
}

function r2ErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as { name?: string; message?: string; $metadata?: { httpStatusCode?: number } };
    const code = e.$metadata?.httpStatusCode;
    const parts = [e.name, e.message].filter(Boolean);
    if (parts.length) return code ? `${parts.join(": ")} (${code})` : parts.join(": ");
  }
  return err instanceof Error ? err.message : "Error desconocido con R2.";
}

/** Comprueba acceso al expediente con la sesión actual (misma lógica que antes en Edge). */
export async function assertCanAccessProceeding(proceedingId: number): Promise<void> {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user?.email) {
    throw new Error("Debes iniciar sesión.");
  }
  const { data: account, error: uaErr } = await supabaseClient
    .from("user_accounts")
    .select("id")
    .ilike("email", user.email)
    .maybeSingle();
  if (uaErr) throw uaErr;
  if (!account) {
    throw new Error("Tu cuenta de correo no está registrada.");
  }
  const { data: proceeding, error: pErr } = await supabaseClient
    .from("proceedings")
    .select("id")
    .eq("id", proceedingId)
    .maybeSingle();
  if (pErr) throw pErr;
  if (!proceeding) {
    throw new Error("Expediente no encontrado.");
  }
}

export function buildStorageKey(proceedingId: number, filename: string): string {
  const safeName = String(filename ?? "archivo")
    .replace(/[^\w.\-()+]/g, "_")
    .slice(0, 180);
  return `proceedings/${proceedingId}/${crypto.randomUUID()}-${safeName}`;
}

/** Sube el archivo al bucket R2 con PutObject (API S3 compatible). */
export async function uploadFileToR2(file: File, proceedingId: number): Promise<{ storageKey: string }> {
  await assertCanAccessProceeding(proceedingId);
  const storageKey = buildStorageKey(proceedingId, file.name);
  const contentType = file.type || "application/octet-stream";
  const body = new Uint8Array(await file.arrayBuffer());

  const s3 = r2Client();
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: r2Bucket(),
        Key: storageKey,
        Body: body,
        ContentType: contentType,
        ContentLength: file.size,
      })
    );
  } catch (err) {
    const detail = r2ErrorMessage(err);
    if (/403|Forbidden|AccessDenied/i.test(detail)) {
      throw new Error(
        `${detail}. Revisa CORS del bucket R2 (origen del front, métodos PUT/GET/DELETE, AllowedHeaders: *).`
      );
    }
    throw new Error(`No se pudo subir el archivo a R2: ${detail}`);
  }

  return { storageKey };
}

export async function getDownloadPresignedUrl(storageKey: string, proceedingId: number): Promise<string> {
  await assertCanAccessProceeding(proceedingId);
  if (!storageKey.startsWith(`proceedings/${proceedingId}/`)) {
    throw new Error("Clave de objeto inválida.");
  }
  const s3 = r2Client();
  const cmd = new GetObjectCommand({ Bucket: r2Bucket(), Key: storageKey });
  try {
    return await getSignedUrl(s3, cmd, { expiresIn: 3600 });
  } catch (err) {
    throw new Error(`No se pudo generar enlace de descarga: ${r2ErrorMessage(err)}`);
  }
}

export async function deleteObjectFromR2(storageKey: string, proceedingId: number): Promise<void> {
  await assertCanAccessProceeding(proceedingId);
  if (!storageKey.startsWith(`proceedings/${proceedingId}/`)) {
    throw new Error("Clave de objeto inválida.");
  }
  const s3 = r2Client();
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: r2Bucket(), Key: storageKey }));
  } catch (err) {
    throw new Error(`No se pudo eliminar el archivo en R2: ${r2ErrorMessage(err)}`);
  }
}
