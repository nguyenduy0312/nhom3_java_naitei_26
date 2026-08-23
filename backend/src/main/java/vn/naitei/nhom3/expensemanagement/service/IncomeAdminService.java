package vn.naitei.nhom3.expensemanagement.service;

import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeFilterRequest;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomePageResponse;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeResponse;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeUpdateRequest;

public interface IncomeAdminService {

    AdminIncomePageResponse getAllSystem(AdminIncomeFilterRequest filter);

    AdminIncomeResponse getById(Long id);

    AdminIncomeResponse update(Long id, AdminIncomeUpdateRequest request);

    void delete(Long id);
}