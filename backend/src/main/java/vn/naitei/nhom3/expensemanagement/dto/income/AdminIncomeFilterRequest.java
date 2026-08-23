package vn.naitei.nhom3.expensemanagement.dto.income;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminIncomeFilterRequest {

    @Min(value = 0, message = "Trang phải bắt đầu từ 0")
    private int page = 0;

    @Min(value = 1, message = "Kích thước trang phải từ 1 đến 100")
    @Max(value = 100, message = "Kích thước trang phải từ 1 đến 100")
    private int size = 10;

        @Pattern(
            regexp = "(?i)^(date|title|amount),(asc|desc)$",
            message = "Sắp xếp phải có dạng field,asc hoặc field,desc")
        private String sort;

    @Positive(message = "userId phải lớn hơn 0")
    private Long userId;

    @Positive(message = "Danh mục phải có id lớn hơn 0")
    private Long categoryId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fromDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate toDate;

    @AssertTrue(message = "Ngày bắt đầu không được sau ngày kết thúc")
    public boolean isDateRangeValid() {
        return fromDate == null || toDate == null || !fromDate.isAfter(toDate);
    }
}