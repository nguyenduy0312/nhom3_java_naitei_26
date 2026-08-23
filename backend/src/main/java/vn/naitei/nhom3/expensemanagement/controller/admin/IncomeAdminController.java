package vn.naitei.nhom3.expensemanagement.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.naitei.nhom3.expensemanagement.common.response.ApiResponse;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeFilterRequest;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomePageResponse;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeResponse;
import vn.naitei.nhom3.expensemanagement.service.IncomeAdminService;

@RestController
@RequestMapping("/api/admin/incomes")
@RequiredArgsConstructor
public class IncomeAdminController {

    private final IncomeAdminService incomeAdminService;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminIncomePageResponse>> getAllSystem(
            @Valid @ModelAttribute AdminIncomeFilterRequest filter) {
        return ResponseEntity.ok(ApiResponse.success(incomeAdminService.getAllSystem(filter)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminIncomeResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(incomeAdminService.getById(id)));
    }
}