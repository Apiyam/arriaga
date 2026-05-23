import { useNavigation } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, Users } from "lucide-react";
import { useMemo } from "react";
import { UserAccount } from "@/types/entities";
import { ResourceDataTable } from "@/components/shared/ResourceDataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const ClientList = () => {
  const { show, create, edit } = useNavigation();

  const permanentFilters = useMemo(
    () => [{ field: "user_role", operator: "eq" as const, value: 1 }],
    []
  );

  const columns = useMemo<ColumnDef<UserAccount>[]>(
    () => [
      {
        id: "register_date",
        accessorKey: "register_date",
        header: "Fecha de registro",
        cell: ({ getValue }) => {
          const v = getValue() as string | undefined;
          return v ? new Date(v).toLocaleDateString("es-ES") : "-";
        },
      },
      {
        id: "first_name",
        accessorKey: "first_name",
        header: "Nombre completo",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="font-medium">
              {row.original.first_name} {row.original.last_name}
            </span>
          </div>
        ),
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (getValue() as string) || "-",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.status}
            activeLabel="ACTIVO"
            inactiveLabel="INACTIVO"
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
              onClick={() => show("clients", row.original.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => edit("clients", row.original.id)}
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
      title="Listado de Clientes"
      description="Gestiona todos los clientes registrados en la plataforma"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => create("clients")} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Añadir Cliente
          </Button>
        </div>

        <ResourceDataTable<UserAccount>
          resource="user_accounts"
          columns={columns}
          permanentFilters={permanentFilters}
          searchFields={[
            { value: "email", label: "Email" },
            { value: "first_name", label: "Nombre" },
            { value: "last_name", label: "Apellido" },
          ]}
          defaultSearchField="email"
          defaultSorter={{ field: "register_date", order: "desc" }}
          emptyMessage="No hay clientes registrados"
        />
      </div>
    </AppLayout>
  );
};
