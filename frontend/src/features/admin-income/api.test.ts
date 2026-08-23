import { beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "@/lib/axios";
import { adminIncomeApi } from "./api";
import type { AdminIncomePage } from "./types";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("adminIncomeApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends the Admin Income list filters without adding unrelated parameters", async () => {
    const filters = {
      page: 1,
      size: 20,
      userId: 7,
      categoryId: 3,
      fromDate: "2026-08-01",
      toDate: "2026-08-31",
    };
    const response: AdminIncomePage = {
      items: [],
      page: 1,
      size: 20,
      totalItems: 0,
      totalPages: 0,
    };
    vi.mocked(apiClient.get).mockResolvedValue({ data: response });

    await adminIncomeApi.getAll(filters);

    expect(apiClient.get).toHaveBeenCalledWith("/admin/incomes", { params: filters });
    expect(vi.mocked(apiClient.get).mock.calls[0][1]?.params).not.toHaveProperty("search");
  });

  it("uses the Admin Income response contract", async () => {
    const response: AdminIncomePage = {
      items: [
        {
          id: 12,
          source: "Salary",
          amount: 5000000,
          date: "2026-08-14",
          note: null,
          categoryId: 3,
          categoryName: "Salary",
          userId: 7,
          userName: "Test User",
          userEmail: "user@example.com",
        },
      ],
      page: 0,
      size: 10,
      totalItems: 1,
      totalPages: 1,
    };
    vi.mocked(apiClient.get).mockResolvedValue({ data: response });

    const result = await adminIncomeApi.getAll({ page: 0, size: 10 });

    expect(result.data.items[0].source).toBe("Salary");
    expect(result.data.items[0].userId).toBe(7);
    expect(result.data.totalItems).toBe(1);
  });

  it("calls the Admin Income detail, update, and delete endpoints", async () => {
    const update = {
      source: "Updated salary",
      amount: 6000000,
      date: "2026-08-15",
      note: null,
    };

    await adminIncomeApi.getById(12);
    await adminIncomeApi.update(12, update);
    await adminIncomeApi.delete(12);

    expect(apiClient.get).toHaveBeenCalledWith("/admin/incomes/12");
    expect(apiClient.put).toHaveBeenCalledWith("/admin/incomes/12", update);
    expect(apiClient.delete).toHaveBeenCalledWith("/admin/incomes/12");
  });
});
