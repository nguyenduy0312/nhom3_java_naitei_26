package vn.naitei.nhom3.expensemanagement.dto.income;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminIncomePageResponse {

    private final List<AdminIncomeResponse> items;
    private final int page;
    private final int size;
    private final long totalItems;
    private final int totalPages;
}