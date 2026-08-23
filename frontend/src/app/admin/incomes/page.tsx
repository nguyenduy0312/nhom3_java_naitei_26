"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import Select from "@/components/ui/Select";
import { useAdminIncomes, useDeleteAdminIncome } from "@/features/admin-income/hooks";
import type { AdminIncomeFilters } from "@/features/admin-income/types";
import { useCategories } from "@/features/category/hooks";
import { useUsers } from "@/features/user/hooks";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 10;
const DEFAULT_SORT = "date,desc";

export default function AdminIncomesPage() {
  const [page, setPage] = useState(0);
  const [userId, setUserId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [dateError, setDateError] = useState("");
  const deleteMutation = useDeleteAdminIncome();

  const filters: AdminIncomeFilters = {
    page,
    size: PAGE_SIZE,
    sort,
    userId: userId ? Number(userId) : undefined,
    categoryId: categoryId ? Number(categoryId) : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  };
  const isValid = !dateError;
  const query = useAdminIncomes(filters, isValid);
  const usersQuery = useUsers({ page: 0, size: 100 }, true);
  const categoriesQuery = useCategories({ type: "INCOME" });
  const data = query.data;
  const users = Array.isArray(usersQuery.data?.content) ? usersQuery.data.content : [];
  const categories = Array.isArray(categoriesQuery.data) ? categoriesQuery.data : [];
  const hasActiveFilter = Boolean(userId || categoryId || fromDate || toDate || sort !== DEFAULT_SORT);

  const updateDate = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setPage(0);
    setDateError(from && to && from > to ? "Ngày bắt đầu không được sau ngày kết thúc" : "");
  };

  const resetFilters = () => {
    setUserId("");
    setCategoryId("");
    setFromDate("");
    setToDate("");
    setSort(DEFAULT_SORT);
    setDateError("");
    setPage(0);
  };

  const deleteIncome = (id: number, source: string) => {
    if (window.confirm(`Xóa khoản thu nhập "${source}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">FinTrack Admin</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            System Income Records
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Audit, inspect, and moderate all user income records across the platform
          </p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-right text-xs text-emerald-800">
          <span className="block font-semibold">Tổng giao dịch</span>
          <strong className="text-lg">{data?.totalItems ?? "-"}</strong>
        </div>
      </header>

      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Select
            label="Người dùng / tài khoản"
            value={userId}
            onChange={(event) => { setUserId(event.target.value); setPage(0); }}
            options={[
              { label: "Tất cả người dùng", value: "" },
              ...users.map((user) => ({ label: `${user.name} (${user.email})`, value: user.id })),
            ]}
          />
          <Select
            label="Danh mục"
            value={categoryId}
            onChange={(event) => { setCategoryId(event.target.value); setPage(0); }}
            options={[
              { label: "Tất cả danh mục", value: "" },
              ...categories.map((category) => ({ label: category.name, value: category.id })),
            ]}
          />
          <Input
            label="Từ ngày"
            type="date"
            value={fromDate}
            error={dateError}
            onChange={(event) => updateDate(event.target.value, toDate)}
          />
          <Input
            label="Đến ngày"
            type="date"
            value={toDate}
            onChange={(event) => updateDate(fromDate, event.target.value)}
          />
          <Select
            label="Sắp xếp"
            value={sort}
            onChange={(event) => { setSort(event.target.value); setPage(0); }}
            options={[
              { label: "Ngày mới nhất", value: "date,desc" },
              { label: "Ngày cũ nhất", value: "date,asc" },
              { label: "Số tiền tăng dần", value: "amount,asc" },
              { label: "Số tiền giảm dần", value: "amount,desc" },
              { label: "Tên A-Z", value: "title,asc" },
              { label: "Tên Z-A", value: "title,desc" },
            ]}
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Đặt lại
          </Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        {query.isError ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertCircle className="h-9 w-9 text-red-500" aria-hidden="true" />
            <p className="font-medium text-gray-900">Không thể tải danh sách khoản thu nhập</p>
            <p className="text-sm text-gray-500">Vui lòng kiểm tra kết nối và thử lại.</p>
            <Button variant="outline" onClick={() => query.refetch()}>Thử lại</Button>
          </div>
        ) : query.isLoading ? (
          <div className="animate-pulse space-y-3 p-6" aria-label="Đang tải danh sách khoản thu nhập">
            <div className="h-10 rounded bg-gray-200" />
            {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-14 rounded bg-gray-100" />)}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="border-b border-[#E2E8F0] bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-[#515f74]">
                  <tr>
                    <th className="px-6 py-3.5">User / Account</th>
                    <th className="px-4 py-3.5">Income Source / Title</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5 text-right">Amount</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {(data?.items ?? []).length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      {hasActiveFilter ? "Không tìm thấy khoản thu nhập phù hợp" : "Chưa có khoản thu nhập nào"}
                    </td></tr>
                  ) : data?.items.map((income) => (
                    <tr key={income.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 text-xs font-bold text-emerald-700">
                            {income.userName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900">{income.userName}</p>
                            <p className="truncate text-xs text-gray-500">{income.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900">{income.source}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {income.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-emerald-600">+{formatCurrency(income.amount)}</td>
                      <td className="px-4 py-4 text-xs font-medium text-gray-600">{formatDate(income.date)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link href={`/admin/incomes/${income.id}`} title="Xem hoặc sửa" aria-label={`Xem hoặc sửa ${income.source}`} className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600">
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </Link>
                          <Link href={`/admin/incomes/${income.id}`} title="Sửa" aria-label={`Sửa ${income.source}`} className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600">
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </Link>
                          <button type="button" title="Xóa" aria-label={`Xóa ${income.source}`} disabled={deleteMutation.isPending} onClick={() => deleteIncome(income.id, income.source)} className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data && (
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E2E8F0] bg-slate-50/40 px-6 py-4 text-sm text-gray-600">
                <span>
                  Hiển thị <strong>{data.totalItems === 0 ? 0 : data.page * data.size + 1}–{data.page * data.size + data.items.length}</strong> trên tổng <strong>{data.totalItems}</strong> khoản thu nhập
                </span>
                <div className={query.isFetching ? "opacity-60" : undefined} aria-busy={query.isFetching}>
                  <Pagination currentPage={data.page} totalPages={data.totalPages} onPageChange={setPage} />
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
