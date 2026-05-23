/** Clases para HTML generado por CKEditor (colores, listas, etc.). */
export const RICH_HTML_CONTENT_CLASS =
  "ck-content prose prose-sm max-w-none rich-html-content text-gray-800";

/** Paleta compartida para color de texto y resaltado en el editor. */
export const CKEDITOR_FONT_COLORS = [
  { color: "#000000", label: "Negro" },
  { color: "#4b5563", label: "Gris" },
  { color: "#dc2626", label: "Rojo" },
  { color: "#ea580c", label: "Naranja" },
  { color: "#ca8a04", label: "Amarillo" },
  { color: "#16a34a", label: "Verde" },
  { color: "#0891b2", label: "Turquesa" },
  { color: "#2563eb", label: "Azul" },
  { color: "#7c3aed", label: "Morado" },
  { color: "#be185d", label: "Rosa" },
] as const;

export const CKEDITOR_FONT_COLOR_CONFIG = {
  colors: [...CKEDITOR_FONT_COLORS],
  columns: 5,
  colorPicker: {
    format: "hex" as const,
  },
};
