import { useNavigation } from "@refinedev/core";
import { useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Eye,
  FileText,
  FolderOpen,
  ClipboardList,
  DollarSign,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Proceeding } from "@/types/entities";
import { AddSpendingModal } from "@/components/gastos/AddSpendingModal";
import { ResourceDataTable } from "@/components/shared/ResourceDataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

const TEXT_COL = "w-[300px] max-w-[300px]";
const ACTIONS_COL = "w-[210px] min-w-[210px]";

function TruncatedText({ value }: { value?: string | null }) {
  const text = value?.trim() || "-";
  return (
    <span className={`block truncate ${TEXT_COL}`} title={text !== "-" ? text : undefined}>
      {text}
    </span>
  );
}

export const ProceedingList = () => {
  const navigate = useNavigate();
  const { show, create, edit } = useNavigation();
  const [spendingModal, setSpendingModal] = useState<{ id: number; name?: string } | null>(
    null
  );

  const columns = useMemo<ColumnDef<Proceeding>[]>(
    () => [
      {
        id: "date_start",
        accessorKey: "date_start",
        header: "Fecha de captura",
        cell: ({ getValue }) => {
          const v = getValue() as string | undefined;
          return v ? new Date(v).toLocaleDateString("es-ES") : "-";
        },
      },
      {
        id: "full_name",
        accessorKey: "full_name",
        header: "Nombre expediente",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{row.original.full_name || "Sin nombre"}</span>
          </div>
        ),
      },
      {
        id: "actor",
        accessorKey: "actor",
        header: "Actor",
        meta: { headerClassName: TEXT_COL, cellClassName: TEXT_COL },
        cell: ({ row }) => <TruncatedText value={row.original.actor} />,
      },
      {
        id: "defendant",
        accessorKey: "defendant",
        header: "Demandado",
        meta: { headerClassName: TEXT_COL, cellClassName: TEXT_COL },
        cell: ({ row }) => <TruncatedText value={row.original.defendant} />,
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
        meta: {
          headerClassName: `${ACTIONS_COL} text-center`,
          cellClassName: `${ACTIONS_COL} text-center`,
        },
        cell: ({ row }) => (
          <div className="flex flex-nowrap items-center justify-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => show("proceedings", row.original.id)}
              className="h-8 w-8 p-0"
              title="Ver expediente"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => edit("proceedings", row.original.id)}
              className="h-8 w-8 p-0"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/expedientes/${row.original.id}/archivos`)}
              className="h-8 w-8 p-0 text-primary hover:text-primary"
              title="Archivos"
            >
              <FolderOpen className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/expedientes/hoja-visita/${row.original.id}`)}
              className="h-8 w-8 p-0"
              title="Hoja de visita"
            >
              <ClipboardList className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setSpendingModal({
                  id: row.original.id,
                  name: row.original.full_name,
                })
              }
              className="h-8 w-8 p-0 text-green-700 hover:text-green-800 hover:bg-green-50"
              title="Añadir gasto"
            >
              <DollarSign className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [edit, navigate, show]
  );

  return (
    <AppLayout
      title="Listado de Expedientes"
      description="Gestiona todos los expedientes registrados en la plataforma"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => create("proceedings")} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Añadir Expediente
          </Button>
        </div>

        <ResourceDataTable<Proceeding>
          resource="proceedings"
          tableClassName="table-fixed"
          columns={columns}
          searchFields={[
            { value: "full_name", label: "Expediente" },
            { value: "actor", label: "Actor" },
            { value: "defendant", label: "Demandado" },
            { value: "amparo", label: "Amparo" },
            { value: "liga", label: "Liga" },
          ]}
          defaultSearchField="full_name"
          defaultSorter={{ field: "date_start", order: "desc" }}
          emptyMessage="No hay expedientes registrados"
        />
      </div>

      {spendingModal && (
        <AddSpendingModal
          open={!!spendingModal}
          onOpenChange={(open) => !open && setSpendingModal(null)}
          proceedingId={spendingModal.id}
          proceedingName={spendingModal.name}
        />
      )}
    </AppLayout>
  );
};
