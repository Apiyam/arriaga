import { useCreate, useUpdate } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { defaultDateTimeLocal, toDateTimeLocal } from "@/lib/datetime";
import { toast } from "@/hooks/use-toast";
import { Audit } from "@/types/entities";
import { useEffect, useState } from "react";

const AUDIT_STATUSES = ["Pendiente", "En Proceso", "Completada", "Cancelada"] as const;

type AuditFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proceedingId: number;
  proceedingName?: string;
  audit?: Audit | null;
  onSaved?: () => void;
};

export function AuditFormModal({
  open,
  onOpenChange,
  proceedingId,
  proceedingName,
  audit,
  onSaved,
}: AuditFormModalProps) {
  const isEdit = !!audit?.id;
  const { mutate: create, isLoading: creating } = useCreate();
  const { mutate: update, isLoading: updating } = useUpdate();
  const isLoading = creating || updating;

  const [dateTime, setDateTime] = useState(defaultDateTimeLocal());
  const [typeAudit, setTypeAudit] = useState("");
  const [statusAudit, setStatusAudit] = useState("Pendiente");
  const [activity, setActivity] = useState("");

  useEffect(() => {
    if (!open) return;
    if (audit) {
      setDateTime(toDateTimeLocal(audit.date_time_audit));
      setTypeAudit(audit.type_audit || "");
      setStatusAudit(audit.status_audit || "Pendiente");
      setActivity(audit.activity || "");
    } else {
      setDateTime(defaultDateTimeLocal());
      setTypeAudit("");
      setStatusAudit("Pendiente");
      setActivity("");
    }
  }, [open, audit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeAudit.trim()) {
      toast({ title: "Indica el tipo de auditoría", variant: "destructive" });
      return;
    }
    const trimmed = activity.replace(/<[^>]*>/g, "").trim();
    if (!trimmed) {
      toast({ title: "Describe la actividad", variant: "destructive" });
      return;
    }

    const values = {
      proceeding: proceedingId,
      date_time_audit: dateTime,
      type_audit: typeAudit.trim(),
      status_audit: statusAudit,
      activity,
      status: audit?.status ?? 1,
    };

    const opts = {
      onSuccess: () => {
        toast({ title: isEdit ? "Auditoría actualizada" : "Auditoría registrada" });
        onOpenChange(false);
        onSaved?.();
      },
      onError: (err: { message?: string }) => {
        toast({
          title: "No se pudo guardar",
          description: err.message,
          variant: "destructive",
        });
      },
    };

    if (isEdit && audit) {
      update({ resource: "audits", id: audit.id, values }, opts);
    } else {
      create({ resource: "audits", values }, opts);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar auditoría" : "Nueva auditoría / audiencia"}</DialogTitle>
          <DialogDescription>
            {proceedingName ? `Expediente: ${proceedingName}` : `Expediente #${proceedingId}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="audit-date">Fecha y hora</Label>
              <Input
                id="audit-date"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="audit-type">Tipo</Label>
              <Input
                id="audit-type"
                value={typeAudit}
                onChange={(e) => setTypeAudit(e.target.value)}
                placeholder="Audiencia, revisión…"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="audit-status">Estado</Label>
              <select
                id="audit-status"
                value={statusAudit}
                onChange={(e) => setStatusAudit(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              >
                {AUDIT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label>Actividad</Label>
            <div className="mt-1 min-h-[200px]">
              <RichTextEditor
                value={activity}
                onChange={setActivity}
                placeholder="Detalle de la audiencia o auditoría…"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando…" : isEdit ? "Actualizar" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
