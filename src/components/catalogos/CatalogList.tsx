import { useNavigation } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { useMemo } from "react";
import { ResourceDataTable } from "@/components/shared/ResourceDataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface CatalogListProps {
  resource: string;
  title: string;
  description: string;
  nameField?: string;
}

type CatalogRow = {
  id: number;
  catalog_name?: string;
  full_name?: string;
  description?: string;
  status?: number;
};

export const CatalogList = ({
  resource,
  title,
  description,
  nameField = "catalog_name",
}: CatalogListProps) => {
  const { create, edit } = useNavigation();

  const columns = useMemo<ColumnDef<CatalogRow>[]>(
    () => [
      {
        id: nameField,
        accessorKey: nameField,
        header: "Nombre",
        cell: ({ row }) => row.original[nameField as keyof CatalogRow] ?? row.original.full_name ?? "-",
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Descripción",
        enableSorting: false,
        cell: ({ getValue }) => {
          const v = (getValue() as string) || "";
          return v.length > 100 ? `${v.slice(0, 100)}…` : v || "-";
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
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => edit(resource, row.original.id)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [edit, nameField, resource]
  );

  const searchFields = useMemo(
    () => [{ value: nameField, label: "Nombre" }],
    [nameField]
  );

  return (
    <AppLayout title={title} description={description}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => create(resource)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Añadir
          </Button>
        </div>

        <ResourceDataTable<CatalogRow>
          resource={resource}
          columns={columns}
          searchFields={searchFields}
          defaultSearchField={nameField}
          defaultSorter={{ field: nameField, order: "asc" }}
          emptyMessage="No hay registros"
        />
      </div>
    </AppLayout>
  );
};
