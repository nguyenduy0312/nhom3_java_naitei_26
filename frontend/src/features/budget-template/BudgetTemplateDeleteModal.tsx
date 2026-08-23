"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface BudgetTemplateDeleteModalProps {
  name: string | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function BudgetTemplateDeleteModal({ name, isDeleting, onCancel, onConfirm }: BudgetTemplateDeleteModalProps) {
  if (!name) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div role="dialog" aria-modal="true" aria-labelledby="delete-budget-template" className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-[#DC2626]">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <h2 id="delete-budget-template" className="text-lg font-bold text-[#131b2e]">Confirm Item Deletion</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#515f74]">Are you sure you want to permanently delete this budget template?</p>
          </div>
        </div>
        <div className="mb-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 text-xs">
          <span className="text-[#515f74]">Template Name:</span>
          <strong className="ml-2 text-[#131b2e]">{name}</strong>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isDeleting}>Cancel</Button>
          <Button type="button" variant="danger" onClick={onConfirm} isLoading={isDeleting}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Permanently Delete
          </Button>
        </div>
      </div>
    </div>
  );
}