import { useForm } from "@refinedev/react-hook-form";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useList } from "@refinedev/core";
import { useParams } from "react-router";
import { Binnacle } from "@/types/entities";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useState, useEffect } from "react";

export const BinnacleEdit = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState<string>("");
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Binnacle>({
    refineCoreProps: {
      resource: "binnacles",
      id: id,
      action: "edit",
      redirect: "list",
    },
  });

  const currentActivity = watch("activity");

  useEffect(() => {
    if (currentActivity) {
      setActivity(currentActivity);
    }
  }, [currentActivity]);

  const handleActivityChange = (value: string) => {
    setActivity(value);
    setValue("activity", value);
  };

  const { data: proceedingsData } = useList({
    resource: "proceedings",
    pagination: { mode: "off" },
  });

  const proceedingValue = watch("proceeding");

  return (
    <AppLayout 
      title="Editar Bitácora" 
      description="Modifica la información de la bitácora"
    >
      <form onSubmit={handleSubmit(onFinish)}>
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="date_time_binnacle">Fecha y Hora *</Label>
              <Input
                id="date_time_binnacle"
                type="datetime-local"
                {...register("date_time_binnacle", { required: true })}
                className="mt-1"
              />
              {errors.date_time_binnacle && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="proceeding">Expediente</Label>
              <select
                id="proceeding"
                {...register("proceeding")}
                value={proceedingValue || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                <option value="">Seleccionar expediente...</option>
                {proceedingsData?.data?.map((proc: any) => (
                  <option key={proc.id} value={proc.id}>
                    {proc.full_name || proc.id_proceeding}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="activity">Actividad *</Label>
            <div className="mt-1">
              <RichTextEditor
                value={activity}
                onChange={handleActivityChange}
                placeholder="Describe la actividad realizada..."
              />
            </div>
            {errors.activity && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Guardando..." : "Actualizar Bitácora"}
            </Button>
          </div>
        </Card>
      </form>
    </AppLayout>
  );
};

