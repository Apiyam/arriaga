export function defaultDateTimeLocal(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function toDateTimeLocal(value?: string | null): string {
  if (!value) return defaultDateTimeLocal();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return defaultDateTimeLocal();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function formatDateTimeEs(value?: string | null): string {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
