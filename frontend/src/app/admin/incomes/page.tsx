"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Pencil, RotateCcw, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import Select from "@/components/ui/Select";
import { useAdminIncomes, useDeleteAdminIncome } from "@/features/admin-income/hooks";
import type { AdminIncomeFilters } from "@/features/admin-income/types";
import { useCategories } from "@/features/category/hooks";
import { useUsers } from "@/features/user/hooks";
import { formatCurrency, formatDate } from "@/lib/utils";
import AdminIncomeDeleteModal from "@/features/admin-income/components/AdminIncomeDeleteModal";

const PAGE_SIZE = 10;
const DEFAULT_SORT = "date,desc";

export default function AdminIncomesPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [userId, setUserId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [dateError, setDateError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteIncome, setDeleteIncome] = useState<import("@/features/admin-income/types").AdminIncome | null>(null);
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
  const hasActiveFilter = Boolean(search || userId || categoryId || fromDate || toDate || sort !== DEFAULT_SORT);

  const updateDate = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setPage(0);
    setDateError(from && to && from > to ? "Start date cannot be after end date" : "");
  };

  const resetFilters = () => {
    setSearch("");
    setUserId("");
    setCategoryId("");
    setFromDate("");
    setToDate("");
    setSort(DEFAULT_SORT);
    setDateError("");
    setPage(0);
  };

  const visibleItems = (data?.items ?? []).filter((income) => {
    const keyword = search.trim().toLowerCase();
    return !keyword || [income.source, income.amount, income.categoryName, income.userName, income.userEmail].join(" ").toLowerCase().includes(keyword);
  });

  const applyDatePreset = (value: string) => {
    const today = new Date();
    if (value === "all") {
      updateDate("", "");
      return;
    }
    const offset = value === "last_month" ? -1 : 0;
    const start = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const end = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0);
    updateDate(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            System Income Records
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Audit, inspect, and moderate all user income records across the platform
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3.5 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-[#515f74]" aria-hidden="true" />
            <input type="text" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Search income title, source, or amount..." aria-label="Search income title, source, or amount" className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-10 pr-4 text-sm transition-all focus:border-[#004ac6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20" />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
          <Select
            value={userId}
            onChange={(event) => { setUserId(event.target.value); setPage(0); }}
            options={[
              { label: "All Users", value: "" },
              ...users.map((user) => ({ label: `${user.name} (${user.email})`, value: user.id })),
            ]}
          />
          <Select
            aria-label="Filter by date range"
            value={fromDate && toDate ? "custom" : "all"}
            onChange={(event) => applyDatePreset(event.target.value)}
            options={[{ label: "All Time", value: "all" }, { label: "This Month", value: "this_month" }, { label: "Last Month", value: "last_month" }, { label: "Custom range", value: "custom" }]}
          />
          <Button variant="ghost" size="sm" onClick={resetFilters}><RotateCcw className="h-4 w-4" aria-hidden="true" />Reset</Button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Select
            label="Category"
            value={categoryId}
            onChange={(event) => { setCategoryId(event.target.value); setPage(0); }}
            options={[
              { label: "All Categories", value: "" },
              ...categories.map((category) => ({ label: category.name, value: category.id })),
            ]}
          />
          <Input
            label="From Date"
            type="date"
            value={fromDate}
            error={dateError}
            onChange={(event) => updateDate(event.target.value, toDate)}
          />
          <Input
            label="To Date"
            type="date"
            value={toDate}
            onChange={(event) => updateDate(fromDate, event.target.value)}
          />
          <Select
            label="Sort"
            value={sort}
            onChange={(event) => { setSort(event.target.value); setPage(0); }}
            options={[
              { label: "Newest date", value: "date,desc" },
              { label: "Oldest date", value: "date,asc" },
              { label: "Amount ascending", value: "amount,asc" },
              { label: "Amount descending", value: "amount,desc" },
              { label: "Name A-Z", value: "title,asc" },
              { label: "Name Z-A", value: "title,desc" },
            ]}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        {query.isError ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertCircle className="h-9 w-9 text-red-500" aria-hidden="true" />
            <p className="font-medium text-gray-900">Unable to load income records</p>
            <p className="text-sm text-gray-500">Check your connection and try again.</p>
            <Button variant="outline" onClick={() => query.refetch()}>Try again</Button>
          </div>
        ) : query.isLoading ? (
          <div className="animate-pulse space-y-3 p-6" aria-label="Loading income records">
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
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5 text-right">Amount</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {visibleItems.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      {hasActiveFilter ? "No matching income records found" : "No income records found"}
                    </td></tr>
                  ) : visibleItems.map((income) => (
                    <tr key={income.id} onClick={() => router.push(`/admin/incomes/${income.id}`)} className="group cursor-pointer transition-colors hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 text-xs font-bold text-emerald-700">
                            {income.userName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900">{income.userName}</p>
                            <p className="truncate text-[11px] text-[#515f74]">User ID: {income.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900">{income.source}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {income.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-base font-bold text-emerald-600">+{formatCurrency(income.amount)}</td>
                      <td className="px-4 py-4 text-xs font-medium text-[#515f74]">{formatDate(income.date)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link href={`/admin/incomes/${income.id}`} onClick={(event) => event.stopPropagation()} title="Edit" aria-label={`Edit ${income.source}`} className="rounded-lg p-1.5 text-[#515f74] hover:bg-blue-50 hover:text-[#004ac6]">
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </Link>
                          <button type="button" title="Delete" aria-label={`Delete ${income.source}`} disabled={deleteMutation.isPending} onClick={(event) => { event.stopPropagation(); setDeleteIncome(income); }} className="rounded-lg p-1.5 text-[#515f74] hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
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
                  Showing <strong>{data.totalItems === 0 ? 0 : data.page * data.size + 1}–{data.page * data.size + data.items.length}</strong> of <strong>{data.totalItems}</strong> income records
                </span>
                <div className={query.isFetching ? "opacity-60" : undefined} aria-busy={query.isFetching}>
                  <Pagination currentPage={data.page} totalPages={data.totalPages} onPageChange={setPage} />
                </div>
              </div>
            )}
          </>
        )}
      </section>
      <AdminIncomeDeleteModal income={deleteIncome} isDeleting={deleteMutation.isPending} errorMessage={deleteMutation.isError ? "Unable to delete this income entry." : undefined} onClose={() => setDeleteIncome(null)} onConfirm={() => deleteIncome && deleteMutation.mutate(deleteIncome.id, { onSuccess: () => setDeleteIncome(null) })} />
    </div>
  );
}
