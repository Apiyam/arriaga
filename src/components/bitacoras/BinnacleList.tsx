import { useNavigation } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye } from "lucide-react";
import { useMemo } from "react";
import { Binnacle } from "@/types/entities";
import { ResourceDataTable } from "@/components/shared/ResourceDataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const BinnacleList = () => {
  const { show, create, edit } = useNavigation();

  const columns = useMemo<ColumnDef<Binnacle>[]>(
    () => [
      {
        id: "date_time_binnacle",
        accessorKey: "date_time_binnacle",
        header: "Fecha",
        cell: ({ getValue }) => {
          const v = getValue() as string | undefined;
          return v ? new Date(v).toLocaleDateString("es-ES") : "-";
        },
      },
      {
        id: "activity",
        accessorKey: "activity",
        header: "Actividad",
        cell: ({ getValue }) => {
          const v = (getValue() as string) || "-";
          return v.length > 120 ? `${v.slice(0, 120)}…` : v;
        },
      },
      {
        id: "proceeding",
        accessorKey: "proceeding",
        header: "Expediente",
        cell: ({ getValue }) => String(getValue() ?? "-"),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.status}
            activeLabel="ACTIVA"
            inactiveLabel="INACTIVA"
          />
        ),
      },
      {
        id: "actions",
        header: "Acciones",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => show("binnacles", row.original.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => edit("binnacles", row.original.id)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [edit, show]
  );

  return (
    <AppLayout
      title="Listado de Bitácoras"
      description="Gestiona todas las bitácoras de actividades"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => create("binnacles")} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Añadir Bitácora
          </Button>
        </div>

        <ResourceDataTable<Binnacle>
          resource="binnacles"
          columns={columns}
          searchFields={[
            { value: "activity", label: "Actividad" },
            { value: "proceeding", label: "ID expediente" },
          ]}
          defaultSearchField="activity"
          defaultSorter={{ field: "date_time_binnacle", order: "desc" }}
          emptyMessage="No hay bitácoras registradas"
        />
      </div>
    </AppLayout>
  );
};
