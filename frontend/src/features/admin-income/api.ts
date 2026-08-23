import apiClient from "@/lib/axios";
import type {
  AdminIncome,
  AdminIncomeFilters,
  AdminIncomePage,
  AdminIncomeUpdateRequest,
} from "./types";

const BASE = "/admin/incomes";

export const adminIncomeApi = {
  getAll: (params: AdminIncomeFilters) =>
    apiClient.get<AdminIncomePage>(BASE, { params }),

  getById: (id: number) =>
    apiClient.get<AdminIncome>(`${BASE}/${id}`),

  update: (id: number, data: AdminIncomeUpdateRequest) =>
    apiClient.put<AdminIncome>(`${BASE}/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`${BASE}/${id}`),
};
