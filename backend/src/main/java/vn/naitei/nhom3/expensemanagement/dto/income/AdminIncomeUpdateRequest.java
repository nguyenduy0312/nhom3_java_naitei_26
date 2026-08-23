package vn.naitei.nhom3.expensemanagement.dto.income;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminIncomeUpdateRequest {

    @NotBlank(message = "Nguồn thu nhập không được để trống")
    @Size(max = 255, message = "Nguồn thu nhập tối đa 255 ký tự")
    private String source;

    @NotNull(message = "Số tiền không được để trống")
    @Positive(message = "Số tiền phải lớn hơn 0")
    private BigDecimal amount;

    @NotNull(message = "Ngày nhận không được để trống")
    @PastOrPresent(message = "Ngày nhận không được là ngày tương lai")
    private LocalDate date;

    private String note;

    @Positive(message = "Danh mục phải có id lớn hơn 0")
    private Long categoryId;
}