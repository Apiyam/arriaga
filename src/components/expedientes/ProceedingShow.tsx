import { useShow, useNavigation, useList } from "@refinedev/core";
import { AppLayout } from "../dashboard/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProceedingActivityTabs } from "./ProceedingActivityTabs";
import { useNavigate, useParams } from "react-router";
import { Edit, ArrowLeft, FileText, FolderOpen } from "lucide-react";
import { Proceeding, Audit, Binnacle, Spending } from "@/types/entities";
import { RICH_HTML_CONTENT_CLASS } from "@/lib/richText";

export const ProceedingShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { edit } = useNavigation();
  const { queryResult } = useShow<Proceeding>({
    resource: "proceedings",
    id: id,
  });

  const { data, isLoading } = queryResult;
  const proceeding = data?.data;

  const { data: binnaclesData } = useList<Binnacle>({
    resource: "binnacles",
    filters: [{ field: "proceeding", operator: "eq", value: id }],
    sorters: [{ field: "date_time_binnacle", order: "desc" }],
    pagination: { mode: "off" },
  });

  const { data: spendingsData } = useList<Spending>({
    resource: "spendings",
    filters: [{ field: "proceeding", operator: "eq", value: id }],
    sorters: [{ field: "date_time_spending", order: "desc" }],
    pagination: { mode: "off" },
  });

  const { data: auditsData } = useList<Audit>({
    resource: "audits",
    filters: [{ field: "proceeding", operator: "eq", value: id }],
    sorters: [{ field: "date_time_audit", order: "desc" }],
    pagination: { mode: "off" },
  });

  const binnacles = binnaclesData?.data || [];
  const spendings = spendingsData?.data || [];
  const audits = auditsData?.data || [];

  if (isLoading) {
    return (
      <AppLayout title="Cargando..." description="">
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!proceeding) {
    return (
      <AppLayout title="Expediente no encontrado" description="">
        <Card className="p-6">
          <p>El expediente solicitado no existe.</p>
        </Card>
      </AppLayout>
    );
  }

  const infoFields = [
    { label: "ID expediente", value: proceeding.id_proceeding },
    { label: "Actor", value: proceeding.actor },
    { label: "Demandado", value: proceeding.defendant },
    {
      label: "Inicio",
      value: proceeding.date_start ? new Date(proceeding.date_start).toLocaleDateString("es-MX") : null,
    },
    {
      label: "Fin",
      value: proceeding.date_end ? new Date(proceeding.date_end).toLocaleDateString("es-MX") : null,
    },
    { label: "AOD", value: proceeding.aod },
    { label: "Amparo", value: proceeding.amparo },
    { label: "Liga", value: proceeding.liga },
  ];

  return (
    <AppLayout
      title={proceeding.full_name || "Detalles del Expediente"}
      description="Expediente, actividad y documentación"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => edit("proceedings", proceeding.id)} className="gap-2">
              <Edit className="w-4 h-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/expedientes/hoja-visita/${proceeding.id}`)}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Hoja de visita
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/expedientes/${proceeding.id}/archivos`)}
              className="gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Archivos
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expediente</p>
              <h2 className="text-xl font-semibold text-gray-800">{proceeding.full_name || "—"}</h2>
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                proceeding.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {proceeding.status === 1 ? "ACTIVO" : "INACTIVO"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 text-sm">
            {infoFields.map((f) => (
              <div key={f.label} className="min-w-0">
                <p className="text-xs text-gray-500">{f.label}</p>
                <p className="font-medium truncate" title={f.value ?? undefined}>
                  {f.value || "—"}
                </p>
              </div>
            ))}
          </div>

          {proceeding.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500 mb-1">Descripción</p>
              <div
                className={`${RICH_HTML_CONTENT_CLASS} max-h-32 overflow-y-auto`}
                dangerouslySetInnerHTML={{ __html: proceeding.description }}
              />
            </div>
          )}
        </Card>

        <ProceedingActivityTabs
          proceedingId={proceeding.id}
          proceedingName={proceeding.full_name}
          binnacles={binnacles}
          spendings={spendings}
          audits={audits}
        />
      </div>
    </AppLayout>
  );
};
