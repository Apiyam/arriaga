import { useNavigation } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye } from "lucide-react";
import { useMemo } from "react";
import { Audit } from "@/types/entities";
import { ResourceDataTable } from "@/components/shared/ResourceDataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const AuditList = () => {
  const { show, create, edit } = useNavigation();

  const columns = useMemo<ColumnDef<Audit>[]>(
    () => [
      {
        id: "date_time_audit",
        accessorKey: "date_time_audit",
        header: "Fecha",
        cell: ({ getValue }) => {
          const v = getValue() as string | undefined;
          return v ? new Date(v).toLocaleDateString("es-ES") : "-";
        },
      },
      {
        id: "type_audit",
        accessorKey: "type_audit",
        header: "Tipo",
        cell: ({ getValue }) => (getValue() as string) || "-",
      },
      {
        id: "status_audit",
        accessorKey: "status_audit",
        header: "Estado auditoría",
        enableSorting: true,
        cell: ({ getValue }) => (getValue() as string) || "N/A",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Registro",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "activity",
        accessorKey: "activity",
        header: "Actividad",
        cell: ({ getValue }) => {
          const v = (getValue() as string) || "-";
          return v.length > 80 ? `${v.slice(0, 80)}…` : v;
        },
      },
      {
        id: "proceeding",
        accessorKey: "proceeding",
        header: "Expediente",
        cell: ({ getValue }) => String(getValue() ?? "-"),
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
              onClick={() => show("audits", row.original.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => edit("audits", row.original.id)}
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
      title="Listado de Auditorías"
      description="Gestiona todas las auditorías y audiencias registradas"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => create("audits")} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Añadir Auditoría
          </Button>
        </div>

        <ResourceDataTable<Audit>
          resource="audits"
          columns={columns}
          searchFields={[
            { value: "activity", label: "Actividad" },
            { value: "type_audit", label: "Tipo" },
            { value: "status_audit", label: "Estado auditoría" },
            { value: "proceeding", label: "ID expediente" },
          ]}
          defaultSearchField="activity"
          defaultSorter={{ field: "date_time_audit", order: "desc" }}
          emptyMessage="No hay auditorías registradas"
        />
      </div>
    </AppLayout>
  );
};
