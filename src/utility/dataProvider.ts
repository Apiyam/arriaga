import type { DataProvider } from "@refinedev/core";
import {
  dataProvider as createSupabaseDataProvider,
  generateFilter,
  handleError,
} from "@refinedev/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Orden con NULL al final (p. ej. expedientes sin fecha de captura). */
export const appDataProvider = (
  supabaseClient: SupabaseClient
): Required<DataProvider> => {
  const base = createSupabaseDataProvider(supabaseClient);

  return {
    ...base,
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
      const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

      const client = meta?.schema
        ? supabaseClient.schema(meta.schema)
        : supabaseClient;

      const query = client.from(resource).select(meta?.select ?? "*", {
        count: meta?.count ?? "exact",
      });

      filters?.forEach((item) => {
        generateFilter(item, query);
      });

      sorters?.forEach((item) => {
        const orderOptions = {
          ascending: item.order === "asc",
          nullsFirst: false,
        };
        const [foreignTable, field] = item.field.split(/\.(?=[^.]+$)/);

        if (foreignTable && field) {
          query
            .select(meta?.select ?? `*, ${foreignTable}(${field})`)
            .order(field, { ...orderOptions, foreignTable });
        } else {
          query.order(item.field, orderOptions);
        }
      });

      if (mode === "server") {
        query.range((current - 1) * pageSize, current * pageSize - 1);
      }

      const { data, count, error } = await query;

      if (error) {
        return handleError(error);
      }

      return {
        data: data || [],
        total: count || 0,
      } as any;
    },
  };
};
