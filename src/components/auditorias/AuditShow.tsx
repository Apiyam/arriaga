import { useShow, useNavigation } from "@refinedev/core";
import { AppLayout } from "../dashboard/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { Edit, ArrowLeft } from "lucide-react";
import { Audit } from "@/types/entities";
import { RICH_HTML_CONTENT_CLASS } from "@/lib/richText";

export const AuditShow = () => {
  const { id } = useParams();
  const { edit } = useNavigation();
  const { queryResult } = useShow<Audit>({
    resource: "audits",
    id: id,
  });

  const { data, isLoading } = queryResult;
  const audit = data?.data;

  if (isLoading) {
    return (
      <AppLayout title="Cargando..." description="">
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!audit) {
    return (
      <AppLayout title="Auditoría no encontrada" description="">
        <Card className="p-6">
          <p>La auditoría solicitada no existe.</p>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title={`Auditoría - ${audit.type_audit || "Sin tipo"}`} 
      description="Información completa de la auditoría"
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
            onClick={() => edit("audits", audit.id)}
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
                {audit.date_time_audit 
                  ? new Date(audit.date_time_audit).toLocaleString('es-ES')
                  : "-"
                }
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Tipo de Auditoría</h3>
              <p className="text-lg">{audit.type_audit || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estado</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                audit.status === 1 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {audit.status_audit || "N/A"}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Captura</h3>
              <p className="text-lg">
                {audit.date_time_capture 
                  ? new Date(audit.date_time_capture).toLocaleString('es-ES')
                  : "-"
                }
              </p>
            </div>
          </div>

          {audit.activity && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Actividad</h3>
              <div 
                className={RICH_HTML_CONTENT_CLASS}
                dangerouslySetInnerHTML={{ __html: audit.activity }}
              />
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

