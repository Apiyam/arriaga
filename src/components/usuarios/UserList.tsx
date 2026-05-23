import { useNavigation } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, Users } from "lucide-react";
import { useMemo } from "react";
import { UserAccount } from "@/types/entities";
import { ResourceDataTable } from "@/components/shared/ResourceDataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const UserList = () => {
  const { show, create, edit } = useNavigation();

  const columns = useMemo<ColumnDef<UserAccount>[]>(
    () => [
      {
        id: "first_name",
        accessorKey: "first_name",
        header: "Nombre",
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
        id: "user_role",
        accessorKey: "user_role",
        header: "Rol",
        cell: ({ getValue }) => String(getValue() ?? "-"),
      },
      {
        id: "last_login_date",
        accessorKey: "last_login_date",
        header: "Último acceso",
        cell: ({ getValue }) => {
          const v = getValue() as string | undefined;
          return v ? new Date(v).toLocaleDateString("es-ES") : "Nunca";
        },
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
              onClick={() => show("user_accounts", row.original.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => edit("user_accounts", row.original.id)}
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
      title="Listado de Usuarios"
      description="Gestiona todos los usuarios del sistema"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => create("user_accounts")} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Añadir Usuario
          </Button>
        </div>

        <ResourceDataTable<UserAccount>
          resource="user_accounts"
          columns={columns}
          searchFields={[
            { value: "email", label: "Email" },
            { value: "first_name", label: "Nombre" },
            { value: "last_name", label: "Apellido" },
          ]}
          defaultSearchField="email"
          defaultSorter={{ field: "register_date", order: "desc" }}
          emptyMessage="No hay usuarios registrados"
        />
      </div>
    </AppLayout>
  );
};
