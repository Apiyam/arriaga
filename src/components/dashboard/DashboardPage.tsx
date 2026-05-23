import { useList } from "@refinedev/core";
import { AppLayout } from "./Layout";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Activity
} from "lucide-react";

export const DashboardPage = () => {
  const { data: proceedingsData } = useList({
    resource: "proceedings",
    pagination: { mode: "off" },
  });

  const { data: auditsData } = useList({
    resource: "audits",
    pagination: { mode: "off" },
  });

  const { data: binnaclesData } = useList({
    resource: "binnacles",
    pagination: { mode: "off" },
  });

  const { data: usersData } = useList({
    resource: "user_accounts",
    pagination: { mode: "off" },
  });

  const totalProceedings = proceedingsData?.total || 0;
  const totalAudits = auditsData?.total || 0;
  const totalBinnacles = binnaclesData?.total || 0;
  const totalUsers = usersData?.total || 0;

  const recentProceedings = proceedingsData?.data?.slice(0, 5) || [];

  return (
    <AppLayout 
      title="Dashboard Principal" 
      description="Administrador de expedientes y archivos para Arturo & Abogados"
    >
      <div className="space-y-6">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expedientes</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{totalProceedings}</p>
                <p className="text-xs text-gray-500 mt-1">Expedientes totales registrados</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auditorías</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{totalAudits}</p>
                <p className="text-xs text-gray-500 mt-1">Auditorías registradas</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bitácoras</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{totalBinnacles}</p>
                <p className="text-xs text-gray-500 mt-1">Bitácoras registradas</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Activity className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Usuarios activos</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Últimos expedientes */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Últimos Expedientes Registrados</h3>
                <a 
              href="/expedientes" 
              className="text-sm text-blue-600 hover:underline"
            >
              Ver todos
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Expediente</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Fecha de captura</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actor</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Demandado</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentProceedings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-6 text-gray-500">
                      No hay expedientes registrados
                    </td>
                  </tr>
                ) : (
                  recentProceedings.map((proceeding: any) => (
                    <tr key={proceeding.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">{proceeding.full_name || "Sin nombre"}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {proceeding.date_start 
                          ? new Date(proceeding.date_start).toLocaleDateString('es-ES')
                          : "-"
                        }
                      </td>
                      <td className="p-3 text-sm">{proceeding.actor || "-"}</td>
                      <td className="p-3 text-sm">{proceeding.defendant || "-"}</td>
                      <td className="p-3 text-center">
                        <a 
                          href={`/expedientes/show/${proceeding.id}`}
                          className="text-primary hover:underline text-sm"
                        >
                          Ver detalles
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

