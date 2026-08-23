package vn.naitei.nhom3.expensemanagement.controller.admin;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.naitei.nhom3.expensemanagement.common.response.ApiResponse;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeFilterRequest;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomePageResponse;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeResponse;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeUpdateRequest;
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

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<AdminIncomeResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody AdminIncomeUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Cập nhật thành công", incomeAdminService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        incomeAdminService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xoá thành công", null));
    }
}