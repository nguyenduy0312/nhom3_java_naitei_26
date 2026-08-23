"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAdminIncome, useDeleteAdminIncome, useUpdateAdminIncome } from "@/features/admin-income/hooks";
import type { AdminIncomeUpdateRequest } from "@/features/admin-income/types";
import { useCategories } from "@/features/category/hooks";
import { formatDate } from "@/lib/utils";
import AdminIncomeEditForm from "./AdminIncomeEditForm";
import AdminIncomeDeleteModal from "./AdminIncomeDeleteModal";

interface AdminIncomeDetailContentProps {
  incomeId: number;
}

export default function AdminIncomeDetailContent({ incomeId }: AdminIncomeDetailContentProps) {
  const router = useRouter();
  const incomeQuery = useAdminIncome(incomeId);
  const updateMutation = useUpdateAdminIncome();
  const deleteMutation = useDeleteAdminIncome();
  const categoriesQuery = useCategories({ type: "INCOME" });
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (incomeQuery.isLoading) {
    return <div className="animate-pulse space-y-4" aria-label="Đang tải khoản thu nhập"><div className="h-8 w-64 rounded bg-gray-200" /><div className="h-96 rounded-2xl bg-gray-100" /></div>;
  }

  if (incomeQuery.isError || !incomeQuery.data) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-9 w-9 text-red-500" aria-hidden="true" />
        <p className="font-medium text-gray-900">Không thể tải khoản thu nhập</p>
        <p className="text-sm text-gray-500">Khoản thu nhập không tồn tại hoặc đã xảy ra lỗi kết nối.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => incomeQuery.refetch()}>Thử lại</Button>
          <Link href="/admin/incomes" className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Quay lại</Link>
        </div>
      </div>
    );
  }

  const income = incomeQuery.data;
  const mutationError = updateMutation.isError || deleteMutation.isError
    ? "Không thể cập nhật khoản thu nhập. Vui lòng thử lại."
    : undefined;

  const submitUpdate = (data: AdminIncomeUpdateRequest) => {
    updateMutation.mutate({ id: incomeId, data }, { onSuccess: () => router.push("/admin/incomes") });
  };

  const confirmDelete = () => setDeleteOpen(true);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav className="flex items-center gap-2 text-xs font-medium text-[#515f74]">
        <Link href="/admin/incomes" className="inline-flex items-center gap-1 hover:text-[#004ac6]"><ArrowLeft className="h-4 w-4" aria-hidden="true" />System Incomes</Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-[#131b2e]">Income Record #{income.id}</span>
      </nav>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Income Record #{income.id}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">{income.source}</h1>
            <p className="mt-1 text-sm text-gray-500">{formatDate(income.date)} · {income.categoryName}</p>
          </div>
          <p className="font-mono text-xl font-bold text-emerald-600">+${income.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <AdminIncomeEditForm
          key={`${income.id}-${income.updatedAt ?? "initial"}`}
          income={income}
          onSubmit={submitUpdate}
          onDelete={confirmDelete}
          isUpdating={updateMutation.isPending}
          isDeleting={deleteMutation.isPending}
          categories={Array.isArray(categoriesQuery.data) ? categoriesQuery.data : []}
          errorMessage={mutationError}
        />
      </div>
      <AdminIncomeDeleteModal
        income={deleteOpen ? income : null}
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? "Unable to delete this income entry." : undefined}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate(incomeId, { onSuccess: () => router.push("/admin/incomes") })}
      />
    </div>
  );
}
