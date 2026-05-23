/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_R2_ACCOUNT_ID: string;
  readonly VITE_R2_ACCESS_KEY_ID: string;
  readonly VITE_R2_SECRET_ACCESS_KEY: string;
  readonly VITE_R2_BUCKET?: string;
  /** Opcional: https://<accountId>.r2.cloudflarestorage.com */
  readonly VITE_R2_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
