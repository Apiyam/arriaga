import { useCreate, useUpdate } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Spending } from "@/types/entities";
import { useEffect, useState } from "react";

const SPENDING_TYPES = ["Honorarios", "Gastos de Oficina", "Trámites", "Otros"] as const;

type SpendingFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proceedingId: number;
  proceedingName?: string;
  spending?: Spending | null;
  onSaved?: () => void;
};

export function SpendingFormModal({
  open,
  onOpenChange,
  proceedingId,
  proceedingName,
  spending,
  onSaved,
}: SpendingFormModalProps) {
  const isEdit = !!spending?.id;
  const { mutate: create, isLoading: creating } = useCreate();
  const { mutate: update, isLoading: updating } = useUpdate();
  const isLoading = creating || updating;

  const [dateTime, setDateTime] = useState(defaultDateTimeLocal());
  const [concept, setConcept] = useState("");
  const [total, setTotal] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (!open) return;
    if (spending) {
      setDateTime(toDateTimeLocal(spending.date_time_spending));
      setConcept(spending.concept || "");
      setTotal(spending.total != null ? String(spending.total) : "");
      setType(spending.type || "");
    } else {
      setDateTime(defaultDateTimeLocal());
      setConcept("");
      setTotal("");
      setType("");
    }
  }, [open, spending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTotal = Number.parseFloat(total);
    if (!concept.trim()) {
      toast({ title: "Concepto requerido", variant: "destructive" });
      return;
    }
    if (!Number.isFinite(parsedTotal) || parsedTotal <= 0) {
      toast({ title: "Indica un monto válido", variant: "destructive" });
      return;
    }

    const values = {
      proceeding: proceedingId,
      date_time_spending: dateTime,
      concept: concept.trim(),
      total: parsedTotal,
      type: type || null,
      status: spending?.status ?? 1,
    };

    const opts = {
      onSuccess: () => {
        toast({ title: isEdit ? "Gasto actualizado" : "Gasto registrado" });
        onOpenChange(false);
        onSaved?.();
      },
      onError: (err: { message?: string }) => {
        toast({
          title: "No se pudo guardar el gasto",
          description: err.message,
          variant: "destructive",
        });
      },
    };

    if (isEdit && spending) {
      update({ resource: "spendings", id: spending.id, values }, opts);
    } else {
      create({ resource: "spendings", values }, opts);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar gasto" : "Añadir gasto"}</DialogTitle>
          <DialogDescription>
            {proceedingName ? `Expediente: ${proceedingName}` : `Expediente #${proceedingId}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="spending-date">Fecha y hora</Label>
            <Input
              id="spending-date"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="spending-concept">Concepto</Label>
            <Input
              id="spending-concept"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Descripción del gasto"
              required
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="spending-total">Monto ($)</Label>
              <Input
                id="spending-total"
                type="number"
                step="0.01"
                min="0.01"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="spending-type">Tipo</Label>
              <select
                id="spending-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              >
                <option value="">—</option>
                {SPENDING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
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

/** @deprecated Usa SpendingFormModal */
export const AddSpendingModal = SpendingFormModal;
