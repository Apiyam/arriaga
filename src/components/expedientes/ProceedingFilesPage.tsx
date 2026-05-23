import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/ui/AlertConfirmation";
import { supabaseClient } from "@/utility";
import { ProceedingFile } from "@/types/entities";
import {
  uploadFileToR2,
  getDownloadPresignedUrl,
  deleteObjectFromR2,
} from "@/lib/r2Storage";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CloudUpload,
  Download,
  Eye,
  File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  FolderOpen,
  LayoutGrid,
  List,
  Loader2,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

function formatBytes(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

type FileKind = "image" | "pdf" | "document" | "spreadsheet" | "archive" | "video" | "audio" | "other";

function fileKind(mime?: string | null, name?: string): FileKind {
  const m = (mime || "").toLowerCase();
  const ext = (name || "").split(".").pop()?.toLowerCase() || "";
  if (m.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext)) return "image";
  if (m === "application/pdf" || ext === "pdf") return "pdf";
  if (m.includes("spreadsheet") || m.includes("excel") || ["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
  if (m.includes("word") || m.includes("document") || ["doc", "docx", "odt", "rtf", "txt"].includes(ext)) return "document";
  if (m.startsWith("video/") || ["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (m.startsWith("audio/") || ["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
  if (m.includes("zip") || m.includes("rar") || ["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  return "other";
}

const FILE_KIND_STYLE: Record<
  FileKind,
  { icon: typeof File; label: string; bg: string; iconColor: string; border: string }
> = {
  image: { icon: FileImage, label: "Imagen", bg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-200" },
  pdf: { icon: FileText, label: "PDF", bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-200" },
  document: { icon: FileText, label: "Documento", bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-200" },
  spreadsheet: { icon: FileSpreadsheet, label: "Hoja", bg: "bg-green-50", iconColor: "text-green-700", border: "border-green-200" },
  archive: { icon: FileArchive, label: "Comprimido", bg: "bg-amber-50", iconColor: "text-amber-700", border: "border-amber-200" },
  video: { icon: FileVideo, label: "Video", bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-200" },
  audio: { icon: File, label: "Audio", bg: "bg-pink-50", iconColor: "text-pink-600", border: "border-pink-200" },
  other: { icon: File, label: "Archivo", bg: "bg-slate-50", iconColor: "text-slate-600", border: "border-slate-200" },
};

type UploadQueueItem = {
  id: string;
  name: string;
  status: "uploading" | "done" | "error";
  error?: string;
};

export const ProceedingFilesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const proceedingId = id ? Number.parseInt(id, 10) : NaN;
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ProceedingFile | null>(null);
  const { data: proceedingRow } = useQuery({
    queryKey: ["proceeding-title", proceedingId],
    queryFn: async () => {
      const { data, error } = await supabaseClient.from("proceedings").select("id, full_name").eq("id", proceedingId).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Number.isFinite(proceedingId),
  });

  const filesQuery = useQuery({
    queryKey: ["proceeding-files", proceedingId],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("proceeding_files")
        .select("*")
        .eq("proceeding_id", proceedingId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProceedingFile[];
    },
    enabled: Number.isFinite(proceedingId),
  });

  const uploadOne = useCallback(
    async (file: File) => {
      const { storageKey } = await uploadFileToR2(file, proceedingId);
      const { error } = await supabaseClient.from("proceeding_files").insert({
        proceeding_id: proceedingId,
        storage_key: storageKey,
        original_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
      });
      if (error) throw error;
    },
    [proceedingId]
  );

  const deleteMutation = useMutation({
    mutationFn: async (row: ProceedingFile) => {
      await deleteObjectFromR2(row.storage_key, proceedingId);
      const { error } = await supabaseClient.from("proceeding_files").delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proceeding-files", proceedingId] });
      setDeleteTarget(null);
    },
  });

  const getDownloadUrl = useCallback(
    async (row: ProceedingFile) => getDownloadPresignedUrl(row.storage_key, proceedingId),
    [proceedingId]
  );

  const isUploading = uploadQueue.some((q) => q.status === "uploading");

  const processFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setUploadError(null);
      const items: UploadQueueItem[] = files.map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        status: "uploading" as const,
      }));
      setUploadQueue((prev) => [...items, ...prev]);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const item = items[i];
        try {
          await uploadOne(file);
          setUploadQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "done" } : q)));
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error al subir";
          setUploadError(msg);
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: "error", error: msg } : q))
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: ["proceeding-files", proceedingId] });
      setTimeout(() => {
        setUploadQueue((prev) => prev.filter((q) => q.status === "uploading" || q.status === "error"));
      }, 4000);
    },
    [uploadOne, queryClient, proceedingId]
  );

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    void processFiles(Array.from(files));
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) void processFiles(files);
  };

  const filteredFiles = useMemo(() => {
    const list = filesQuery.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((f) => f.original_name?.toLowerCase().includes(q));
  }, [filesQuery.data, search]);

  const totalSize = useMemo(
    () => (filesQuery.data ?? []).reduce((acc, f) => acc + (f.size_bytes ?? 0), 0),
    [filesQuery.data]
  );

  const openUrl = async (row: ProceedingFile) => {
    setBusyId(row.id);
    try {
      const url = await getDownloadUrl(row);
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setBusyId(null);
    }
  };

  const downloadFile = async (row: ProceedingFile) => {
    setBusyId(row.id);
    try {
      const url = await getDownloadUrl(row);
      const a = document.createElement("a");
      a.href = url;
      a.download = row.original_name || "archivo";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setBusyId(null);
    }
  };

  const FileCard = ({ row }: { row: ProceedingFile }) => {
    const kind = fileKind(row.mime_type, row.original_name);
    const style = FILE_KIND_STYLE[kind];
    const Icon = style.icon;
    const busy = busyId === row.id;

    return (
      <div
        role="button"
        tabIndex={0}
        onDoubleClick={() => openUrl(row)}
        onKeyDown={(e) => {
          if (e.key === "Enter") openUrl(row);
        }}
        title="Doble clic para abrir"
        className={cn(
          "group relative flex flex-col rounded-xl border bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default",
          style.border,
          viewMode === "list" && "flex-row items-center gap-4 p-3"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-t-xl",
            style.bg,
            viewMode === "grid" ? "h-28" : "h-14 w-14 shrink-0 rounded-lg"
          )}
        >
          <Icon className={cn(style.iconColor, viewMode === "grid" ? "h-12 w-12" : "h-7 w-7")} strokeWidth={1.25} />
        </div>

        <div className={cn("flex flex-1 flex-col p-3", viewMode === "list" && "min-w-0 py-0")}>
          <p className="font-medium text-sm text-gray-800 line-clamp-2 break-all" title={row.original_name}>
            {row.original_name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {style.label} · {formatBytes(row.size_bytes)}
          </p>
          <p className="text-xs text-muted-foreground/80">
            {row.created_at ? new Date(row.created_at).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) : "—"}
          </p>
        </div>

        <div
          className={cn(
            "flex gap-1 p-2 pt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity",
            viewMode === "list" && "p-0 shrink-0"
          )}
        >
          <Button type="button" size="icon" variant="outline" className="h-8 w-8" disabled={busy} onClick={() => openUrl(row)} title="Ver">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button type="button" size="icon" variant="outline" className="h-8 w-8" disabled={busy} onClick={() => downloadFile(row)} title="Descargar">
            <Download className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={deleteMutation.isPending}
            onClick={() => setDeleteTarget(row)}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (!Number.isFinite(proceedingId)) {
    return (
      <AppLayout title="Archivos" description="">
        <Card className="p-6">
          <p>Expediente no válido.</p>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`Repositorio — ${proceedingRow?.full_name || `Expediente ${proceedingId}`}`}
      description="Documentos del expediente almacenados de forma segura. Arrastra archivos o selecciónalos desde tu equipo."
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(`/expedientes/show/${proceedingId}`)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al expediente
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderOpen className="h-4 w-4" />
            <span>
              {filesQuery.data?.length ?? 0} archivo{(filesQuery.data?.length ?? 0) === 1 ? "" : "s"} · {formatBytes(totalSize)} total
            </span>
          </div>
        </div>

        {/* Zona drag & drop */}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false);
          }}
          onDrop={onDrop}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={cn(
            "relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01] shadow-inner"
              : "border-gray-300 bg-gradient-to-b from-slate-50 to-white hover:border-gray-400 hover:bg-slate-50/80",
            isUploading && "pointer-events-none opacity-70"
          )}
        >
          <input ref={inputRef} type="file" multiple className="hidden" onChange={onPickFiles} />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            {isUploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <CloudUpload className="h-7 w-7" />}
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-800">
            {dragOver ? "Suelta los archivos aquí" : "Arrastra archivos o haz clic para subir"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            PDF, imágenes, Office, ZIP y más. Puedes seleccionar varios a la vez.
          </p>
        </div>

        {uploadQueue.length > 0 && (
          <Card className="p-4 space-y-3 border-primary/20 bg-primary/[0.02]">
            <p className="text-sm font-medium text-gray-700">Cola de subida</p>
            <ul className="space-y-2">
              {uploadQueue.map((item) => (
                <li key={item.id} className="flex items-center gap-3 text-sm">
                  {item.status === "uploading" && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />}
                  {item.status === "done" && <span className="h-4 w-4 shrink-0 rounded-full bg-emerald-500" />}
                  {item.status === "error" && <span className="h-4 w-4 shrink-0 rounded-full bg-red-500" />}
                  <span className="flex-1 truncate text-gray-700">{item.name}</span>
                  <span
                    className={cn(
                      "text-xs",
                      item.status === "error" && "text-red-600",
                      item.status === "done" && "text-emerald-600",
                      item.status === "uploading" && "text-primary"
                    )}
                  >
                    {item.status === "uploading" && "Subiendo…"}
                    {item.status === "done" && "Listo"}
                    {item.status === "error" && (item.error || "Error")}
                  </span>
                </li>
              ))}
            </ul>
            {isUploading && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
              </div>
            )}
          </Card>
        )}

        {uploadError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            <span className="flex-1">{uploadError}</span>
            <button type="button" onClick={() => setUploadError(null)} className="shrink-0 rounded p-0.5 hover:bg-red-100" aria-label="Cerrar">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Barra del repositorio */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar en el repositorio…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex rounded-lg border bg-muted/30 p-0.5">
            <Button
              type="button"
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              className="h-8 gap-1.5"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              Cuadrícula
            </Button>
            <Button
              type="button"
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              className="h-8 gap-1.5"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
          </div>
        </div>

        {/* Archivos */}
        {filesQuery.isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Cargando repositorio…</p>
          </div>
        ) : filesQuery.isError ? (
          <Card className="p-8 text-center text-red-600">
            No se pudieron cargar los archivos. Verifica `proceeding_files`, RLS y las variables VITE_R2_* en `.env`.
          </Card>
        ) : !filteredFiles.length ? (
          <Card className="flex flex-col items-center justify-center gap-2 border-dashed py-16 text-center text-muted-foreground">
            <FolderOpen className="h-12 w-12 opacity-40" />
            <p className="font-medium text-gray-600">
              {search ? "Ningún archivo coincide con la búsqueda" : "El repositorio está vacío"}
            </p>
            <p className="text-sm">{search ? "Prueba otro término." : "Sube el primer documento arrastrándolo arriba."}</p>
          </Card>
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-2"
            )}
          >
            {filteredFiles.map((row) => (
              <FileCard key={row.id} row={row} />
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar archivo"
        description={
          deleteTarget
            ? `¿Eliminar «${deleteTarget.original_name}» del repositorio y del almacenamiento? Esta acción no se puede deshacer.`
            : ""
        }
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
      />
    </AppLayout>
  );
};
