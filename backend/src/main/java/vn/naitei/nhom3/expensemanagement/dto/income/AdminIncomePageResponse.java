package vn.naitei.nhom3.expensemanagement.dto.income;

import java.util.List;

public class AdminIncomePageResponse {

    private final List<AdminIncomeResponse> items;
    private final int page;
    private final int size;
    private final long totalItems;
    private final int totalPages;

    public AdminIncomePageResponse(
            List<AdminIncomeResponse> items,
            int page,
            int size,
            long totalItems,
            int totalPages) {
        this.items = items;
        this.page = page;
        this.size = size;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }

    public List<AdminIncomeResponse> getItems() {
        return items;
    }

    public int getPage() {
        return page;
    }

    public int getSize() {
        return size;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public int getTotalPages() {
        return totalPages;
    }
}