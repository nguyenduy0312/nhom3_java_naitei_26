"use client";

import { AlertTriangle, Landmark, Trash2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import type { AdminIncome } from "../types";

interface AdminIncomeDeleteModalProps {
  income: AdminIncome | null;
  isDeleting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminIncomeDeleteModal({ income, isDeleting, errorMessage, onClose, onConfirm }: AdminIncomeDeleteModalProps) {
  if (!income) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div role="dialog" aria-modal="true" aria-labelledby="delete-system-income" className="relative w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl">
        <button type="button" onClick={onClose} disabled={isDeleting} aria-label="Close delete dialog" className="absolute right-4 top-4 rounded-lg p-1.5 text-[#515f74] hover:bg-slate-50 hover:text-[#131b2e] disabled:opacity-50">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600">
            <Landmark className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="pr-5">
            <div className="mb-1 flex items-center gap-1.5">
              <h2 id="delete-system-income" className="text-lg font-bold text-[#131b2e]">Delete System Income</h2>
              <span className="rounded border border-pink-200 bg-pink-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-800">ADMIN</span>
            </div>
            <p className="text-sm leading-relaxed text-[#515f74]">Are you sure you want to delete income entry <strong className="font-semibold text-[#131b2e]">&quot;{income.source}&quot;</strong>?</p>
          </div>
        </div>
        <div className="mb-4 space-y-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 text-xs">
          <div className="flex justify-between gap-4"><span className="text-[#515f74]">Owner Account:</span><span className="text-right font-semibold text-[#131b2e]">{income.userName} (ID: {income.userId})</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#515f74]">Category:</span><span className="font-semibold text-emerald-600">{income.categoryName}</span></div>
          <div className="flex justify-between gap-4"><span className="text-[#515f74]">Amount:</span><span className="font-mono font-bold text-emerald-600">+${income.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
        </div>
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs leading-relaxed text-red-900">
          <AlertTriangle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-600" aria-hidden="true" />
          <span>Deleting this income entry will decrease the user&apos;s recorded savings balance and create a permanent audit entry.</span>
        </div>
        {errorMessage && <p role="alert" className="mb-4 text-sm text-red-600">{errorMessage}</p>}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>Cancel</Button>
          <Button type="button" variant="danger" onClick={onConfirm} isLoading={isDeleting}><Trash2 className="h-4 w-4" aria-hidden="true" />Confirm Delete</Button>
        </div>
      </div>
    </div>
  );
}