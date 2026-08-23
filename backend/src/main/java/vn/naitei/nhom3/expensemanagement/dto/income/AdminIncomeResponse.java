package vn.naitei.nhom3.expensemanagement.dto.income;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class AdminIncomeResponse {

    private final Long id;
    private final String source;
    private final BigDecimal amount;
    private final LocalDate date;
    private final String note;
    private final Long categoryId;
    private final String categoryName;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final Long userId;
    private final String userName;
    private final String userEmail;

    public AdminIncomeResponse(
            Long id,
            String source,
            BigDecimal amount,
            LocalDate date,
            String note,
            Long categoryId,
            String categoryName,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
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