import { useShow, useNavigation } from "@refinedev/core";
import { AppLayout } from "../dashboard/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { Edit, ArrowLeft, DollarSign } from "lucide-react";
import { Spending } from "@/types/entities";

export const SpendingShow = () => {
  const { id } = useParams();
  const { edit } = useNavigation();
  const { queryResult } = useShow<Spending>({
    resource: "spendings",
    id: id,
  });

  const { data, isLoading } = queryResult;
  const spending = data?.data;

  if (isLoading) {
    return (
      <AppLayout title="Cargando..." description="">
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!spending) {
    return (
      <AppLayout title="Gasto no encontrado" description="">
        <Card className="p-6">
          <p>El gasto solicitado no existe.</p>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title={`Gasto - ${spending.concept || "Sin concepto"}`} 
      description="Información completa del gasto"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <Button
            onClick={() => edit("spendings", spending.id)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha y Hora</h3>
              <p className="text-lg">
                {spending.date_time_spending 
                  ? new Date(spending.date_time_spending).toLocaleString('es-ES')
                  : "-"
                }
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total</h3>
              <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                ${(spending.total || 0).toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Concepto</h3>
              <p className="text-lg">{spending.concept || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Tipo</h3>
              <p className="text-lg">{spending.type || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estado</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                spending.status === 1 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {spending.status === 1 ? "ACTIVO" : "INACTIVO"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

