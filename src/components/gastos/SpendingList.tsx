import { useNavigation } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye } from "lucide-react";
import { useMemo } from "react";
import { Spending } from "@/types/entities";
import { ResourceDataTable } from "@/components/shared/ResourceDataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const SpendingList = () => {
  const { show, create, edit } = useNavigation();

  const columns = useMemo<ColumnDef<Spending>[]>(
    () => [
      {
        id: "date_time_spending",
        accessorKey: "date_time_spending",
        header: "Fecha",
        cell: ({ getValue }) => {
          const v = getValue() as string | undefined;
          return v ? new Date(v).toLocaleDateString("es-ES") : "-";
        },
      },
      {
        id: "concept",
        accessorKey: "concept",
        header: "Concepto",
        cell: ({ getValue }) => (getValue() as string) || "-",
      },
      {
        id: "type",
        accessorKey: "type",
        header: "Tipo",
        cell: ({ getValue }) => (getValue() as string) || "-",
      },
      {
        id: "total",
        accessorKey: "total",
        header: "Total",
        cell: ({ getValue }) => (
          <span className="font-semibold">${Number(getValue() ?? 0).toFixed(2)}</span>
        ),
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
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
              onClick={() => show("spendings", row.original.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => edit("spendings", row.original.id)}
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
    <AppLayout title="Listado de Gastos" description="Gestiona todos los gastos registrados">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => create("spendings")} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Añadir Gasto
          </Button>
        </div>

        <ResourceDataTable<Spending>
          resource="spendings"
          columns={columns}
          searchFields={[
            { value: "concept", label: "Concepto" },
            { value: "type", label: "Tipo" },
            { value: "proceeding", label: "ID expediente" },
          ]}
          defaultSearchField="concept"
          defaultSorter={{ field: "date_time_spending", order: "desc" }}
          emptyMessage="No hay gastos registrados"
        />
      </div>
    </AppLayout>
  );
};
