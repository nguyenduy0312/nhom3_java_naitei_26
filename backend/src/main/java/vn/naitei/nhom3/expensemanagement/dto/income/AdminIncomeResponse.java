package vn.naitei.nhom3.expensemanagement.dto.income;

import lombok.Getter;

@Getter
public class AdminIncomeResponse {

    private final Long id;
    private final String source;
    private final java.math.BigDecimal amount;
    private final java.time.LocalDate date;
    private final String note;
    private final Long categoryId;
    private final String categoryName;
    private final java.time.LocalDateTime createdAt;
    private final java.time.LocalDateTime updatedAt;
    private final Long userId;
    private final String userName;
    private final String userEmail;

    public AdminIncomeResponse(
            Long id,
            String source,
            java.math.BigDecimal amount,
            java.time.LocalDate date,
            String note,
            Long categoryId,
            String categoryName,
            java.time.LocalDateTime createdAt,
            java.time.LocalDateTime updatedAt,
            Long userId,
            String userName,
            String userEmail) {
        this.id = id;
        this.source = source;
        this.amount = amount;
        this.date = date;
        this.note = note;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
    }
}