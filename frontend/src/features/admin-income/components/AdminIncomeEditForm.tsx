"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { AdminIncome, AdminIncomeUpdateRequest } from "../types";

interface AdminIncomeEditFormProps {
  income: AdminIncome;
  onSubmit: (data: AdminIncomeUpdateRequest) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
  errorMessage?: string;
}

export default function AdminIncomeEditForm({
  income,
  onSubmit,
  onDelete,
  isUpdating,
  isDeleting,
  errorMessage,
}: AdminIncomeEditFormProps) {
  const [source, setSource] = useState(income.source);
  const [amount, setAmount] = useState(String(income.amount));
  const [date, setDate] = useState(income.date);
  const [note, setNote] = useState(income.note ?? "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      source: source.trim(),
      amount: Number(amount),
      date,
      note: note.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-900">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
            {income.userName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-950">
              Record Owner: <span className="font-bold">{income.userName}</span>
            </p>
            <p className="text-[11px] text-emerald-800">
              {income.userEmail} (User ID: {income.userId})
            </p>
          </div>
        </div>
        <span className="w-fit rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-xs font-bold text-emerald-700">
          Income Record
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Income Source / Title"
          id="source"
          required
          value={source}
          onChange={(event) => setSource(event.target.value)}
          className="md:col-span-2"
        />
        <Input
          label="Amount"
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <Input
          label="Received Date"
          id="date"
          type="date"
          required
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="note" className="mb-1 block text-sm font-medium text-gray-700">
          Remarks & Transaction Notes
        </label>
        <textarea
          id="note"
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="danger"
          size="sm"
          isLoading={isDeleting}
          disabled={isUpdating}
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete Income
        </Button>
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/incomes"
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <Button type="submit" isLoading={isUpdating} disabled={isDeleting}>
            <Check className="h-4 w-4" aria-hidden="true" />
            Update Income
          </Button>
        </div>
      </div>
    </form>
  );
}
