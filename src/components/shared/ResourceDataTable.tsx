import { useTable } from "@refinedev/core";
import type { BaseRecord, CrudFilter, CrudSort, HttpError } from "@refinedev/core";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

export type StatusFilterValue = "active" | "inactive" | "all";

export interface SearchFieldOption {
  value: string;
  label: string;
}

export type ResourceColumnMeta = {
  headerClassName?: string;
  cellClassName?: string;
};

export interface ResourceDataTableProps<T extends BaseRecord> {
  resource: string;
  columns: ColumnDef<T>[];
  tableClassName?: string;
  searchFields?: SearchFieldOption[];
  defaultSearchField?: string;
  permanentFilters?: CrudFilter[];
  defaultSorter?: CrudSort;
  statusField?: string;
  defaultStatusFilter?: StatusFilterValue;
  hideStatusFilter?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  emptyMessage?: string;
  toolbarExtra?: ReactNode;
}

function columnMeta(column: { columnDef: { meta?: unknown } }): ResourceColumnMeta {
  return (column.columnDef.meta as ResourceColumnMeta | undefined) ?? {};
}

const DEFAULT_PAGE_SIZES = [25, 50, 100, 200, 500];

export function ResourceDataTable<T extends BaseRecord>({
  resource,
  columns,
  searchFields = [],
  defaultSearchField,
  permanentFilters,
  defaultSorter,
  statusField = "status",
  defaultStatusFilter = "active",
  hideStatusFilter = false,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  defaultPageSize = 50,
  emptyMessage = "No hay registros",
  toolbarExtra,
  tableClassName,
}: ResourceDataTableProps<T>) {
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(defaultStatusFilter);
  const [searchField, setSearchField] = useState(
    defaultSearchField ?? searchFields[0]?.value ?? ""
  );
  const [searchInput, setSearchInput] = useState("");

  const {
    tableQuery: { isLoading, isFetching, data: listData },
    current,
    setCurrent,
    pageSize,
    setPageSize,
    sorters,
    setSorters,
    setFilters,
    pageCount,
  } = useTable<T, HttpError, T>({
    resource,
    pagination: { pageSize: defaultPageSize },
    sorters: defaultSorter ? { initial: [defaultSorter] } : undefined,
    filters: { defaultBehavior: "replace" },
    syncWithLocation: true,
  });

  const tableData = listData?.data ?? [];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount,
    state: {
      pagination: { pageIndex: current - 1, pageSize },
      sorting: sorters.map((s) => ({ id: s.field, desc: s.order === "desc" })),
    },
  });

  const buildFilters = useCallback((): CrudFilter[] => {
    const filters: CrudFilter[] = permanentFilters ? [...permanentFilters] : [];
    if (!hideStatusFilter) {
      if (statusFilter === "active") {
        filters.push({ field: statusField, operator: "eq", value: 1 });
      } else if (statusFilter === "inactive") {
        filters.push({ field: statusField, operator: "eq", value: 0 });
      }
    }
    const term = searchInput.trim();
    if (term && searchField) {
      filters.push({ field: searchField, operator: "contains", value: term });
    }
    return filters;
  }, [
    permanentFilters,
    hideStatusFilter,
    statusField,
    statusFilter,
    searchInput,
    searchField,
  ]);

  useEffect(() => {
    setFilters(buildFilters(), "replace");
    setCurrent(1);
  }, [buildFilters, setFilters, setCurrent]);

  const applySearch = () => {
    setFilters(buildFilters(), "replace");
    setCurrent(1);
  };

  const toggleSort = (field: string) => {
    const currentSort = sorters.find((s) => s.field === field);
    if (!currentSort) {
      setSorters([{ field, order: "asc" }]);
      return;
    }
    if (currentSort.order === "asc") {
      setSorters([{ field, order: "desc" }]);
      return;
    }
    setSorters([]);
  };

  const sortIcon = (field: string) => {
    const sort = sorters.find((s) => s.field === field);
    if (!sort) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    if (sort.order === "asc") return <ArrowUp className="h-3.5 w-3.5" />;
    return <ArrowDown className="h-3.5 w-3.5" />;
  };

  const { getHeaderGroups, getRowModel } = table;
  const rows = getRowModel().rows;
  const total = listData?.total ?? 0;
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);
  const loading = isLoading || isFetching;

  const sortableColumnIds = useMemo(() => {
    return new Set(
      columns
        .map((c) => {
          if (c.enableSorting === false) return null;
          if (typeof c.id === "string") return c.id;
          if ("accessorKey" in c && typeof c.accessorKey === "string") return c.accessorKey;
          return null;
        })
        .filter(Boolean) as string[]
    );
  }, [columns]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          {!hideStatusFilter && (
            <div className="min-w-[160px]">
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilterValue)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
              >
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="all">Todos</option>
              </select>
            </div>
          )}

          {searchFields.length > 0 && (
            <>
              <div className="min-w-[180px]">
                <label className="block text-sm font-medium mb-2">Buscar en</label>
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  {searchFields.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Texto</label>
                <div className="flex gap-2">
                  <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applySearch())}
                    placeholder="Filtrar..."
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={applySearch}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {toolbarExtra}
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className={["w-full", tableClassName].filter(Boolean).join(" ")}>
            <thead className="bg-gray-50 border-b">
              {getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const colId =
                      header.column.id ||
                      (header.column.columnDef as { accessorKey?: string }).accessorKey ||
                      "";
                    const canSort = sortableColumnIds.has(colId);
                    const { headerClassName } = columnMeta(header.column);
                    return (
                      <th
                        key={header.id}
                        className={[
                          "text-left p-3 text-sm font-medium text-gray-700",
                          headerClassName,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {canSort ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(colId)}
                            className="inline-flex items-center gap-1 hover:text-gray-900"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {sortIcon(colId)}
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center p-6">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center p-6 text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => {
                      const { cellClassName } = columnMeta(cell.column);
                      return (
                        <td
                          key={cell.id}
                          className={["p-3 text-sm", cellClassName].filter(Boolean).join(" ")}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            {total > 0 ? (
              <>
                Mostrando <span className="font-medium">{from}</span>–
                <span className="font-medium">{to}</span> de{" "}
                <span className="font-medium">{total}</span> registros
              </>
            ) : (
              "Sin registros"
            )}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Por página
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrent(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded-md bg-white"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={current <= 1 || loading}
                onClick={() => setCurrent((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2 min-w-[80px] text-center">
                {pageCount > 0 ? `${current} / ${pageCount}` : "—"}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={current >= pageCount || pageCount === 0 || loading}
                onClick={() => setCurrent((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
