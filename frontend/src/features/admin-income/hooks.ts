import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminIncomeApi } from "./api";
import type { AdminIncomeFilters, AdminIncomeUpdateRequest } from "./types";

const QUERY_KEY = "admin-incomes";

export function useAdminIncomes(filters: AdminIncomeFilters, enabled = true) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => adminIncomeApi.getAll(filters).then((response) => response.data),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useAdminIncome(id: number | undefined, enabled = true) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => adminIncomeApi.getById(id as number).then((response) => response.data),
    enabled: enabled && id !== undefined,
  });
}

export function useUpdateAdminIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminIncomeUpdateRequest }) =>
      adminIncomeApi.update(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteAdminIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminIncomeApi.delete(id),
    onSuccess: (_response, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [QUERY_KEY, id] });
    },
  });
}
