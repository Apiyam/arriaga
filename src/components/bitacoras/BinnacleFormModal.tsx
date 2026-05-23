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
import { Binnacle } from "@/types/entities";
import { useEffect, useState } from "react";

type BinnacleFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proceedingId: number;
  proceedingName?: string;
  binnacle?: Binnacle | null;
  onSaved?: () => void;
};

export function BinnacleFormModal({
  open,
  onOpenChange,
  proceedingId,
  proceedingName,
  binnacle,
  onSaved,
}: BinnacleFormModalProps) {
  const isEdit = !!binnacle?.id;
  const { mutate: create, isLoading: creating } = useCreate();
  const { mutate: update, isLoading: updating } = useUpdate();
  const isLoading = creating || updating;

  const [dateTime, setDateTime] = useState(defaultDateTimeLocal());
  const [activity, setActivity] = useState("");

  useEffect(() => {
    if (!open) return;
    if (binnacle) {
      setDateTime(toDateTimeLocal(binnacle.date_time_binnacle));
      setActivity(binnacle.activity || "");
    } else {
      setDateTime(defaultDateTimeLocal());
      setActivity("");
    }
  }, [open, binnacle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = activity.replace(/<[^>]*>/g, "").trim();
    if (!trimmed) {
      toast({ title: "Describe la actividad", variant: "destructive" });
      return;
    }

    const values = {
      proceeding: proceedingId,
      date_time_binnacle: dateTime,
      activity,
      status: binnacle?.status ?? 1,
    };

    const opts = {
      onSuccess: () => {
        toast({ title: isEdit ? "Bitácora actualizada" : "Bitácora registrada" });
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

    if (isEdit && binnacle) {
      update({ resource: "binnacles", id: binnacle.id, values }, opts);
    } else {
      create({ resource: "binnacles", values }, opts);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar bitácora" : "Nueva bitácora"}</DialogTitle>
          <DialogDescription>
            {proceedingName ? `Expediente: ${proceedingName}` : `Expediente #${proceedingId}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="binnacle-date">Fecha y hora</Label>
            <Input
              id="binnacle-date"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label>Actividad</Label>
            <div className="mt-1 min-h-[200px]">
              <RichTextEditor
                value={activity}
                onChange={setActivity}
                placeholder="Describe la actividad realizada…"
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
