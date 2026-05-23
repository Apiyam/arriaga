import { useForm } from "@refinedev/react-hook-form";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useList } from "@refinedev/core";
import { useParams } from "react-router";
import { Spending } from "@/types/entities";

export const SpendingEdit = () => {
  const { id } = useParams();
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Spending>({
    refineCoreProps: {
      resource: "spendings",
      id: id,
      action: "edit",
      redirect: "list",
    },
  });

  const { data: proceedingsData } = useList({
    resource: "proceedings",
    pagination: { mode: "off" },
  });

  return (
    <AppLayout 
      title="Editar Gasto" 
      description="Modifica la información del gasto"
    >
      <form onSubmit={handleSubmit(onFinish)}>
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="date_time_spending">Fecha y Hora *</Label>
              <Input
                id="date_time_spending"
                type="datetime-local"
                {...register("date_time_spending", { required: true })}
                className="mt-1"
              />
              {errors.date_time_spending && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="total">Total *</Label>
              <Input
                id="total"
                type="number"
                step="0.01"
                {...register("total", { required: true, valueAsNumber: true })}
                className="mt-1"
              />
              {errors.total && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="concept">Concepto *</Label>
              <Input
                id="concept"
                {...register("concept", { required: true })}
                className="mt-1"
              />
              {errors.concept && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                {...register("type")}
                value={watch("type") || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                <option value="">Seleccionar tipo...</option>
                <option value="Honorarios">Honorarios</option>
                <option value="Gastos de Oficina">Gastos de Oficina</option>
                <option value="Trámites">Trámites</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div>
              <Label htmlFor="proceeding">Expediente</Label>
              <select
                id="proceeding"
                {...register("proceeding")}
                value={watch("proceeding") || ""}
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

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Guardando..." : "Actualizar Gasto"}
            </Button>
          </div>
        </Card>
      </form>
    </AppLayout>
  );
};

