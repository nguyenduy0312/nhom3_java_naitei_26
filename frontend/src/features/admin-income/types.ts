export interface AdminIncome {
  id: number;
  source: string;
  amount: number;
  date: string;
  note?: string | null;
  categoryId: number;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string | null;
  userId: number;
  userName: string;
  userEmail: string;
}

export interface AdminIncomePage {
  items: AdminIncome[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminIncomeFilters {
  page: number;
  size: number;
  userId?: number;
  categoryId?: number;
  fromDate?: string;
  toDate?: string;
  sort?: string;
}

export interface AdminIncomeUpdateRequest {
  source?: string;
  amount?: number;
  date?: string;
  note?: string | null;
}

export type AdminIncomeDeleteInput = number;
