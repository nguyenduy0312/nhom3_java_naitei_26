package vn.naitei.nhom3.expensemanagement.income;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeUpdateRequest;

class AdminIncomeUpdateRequestValidationTest {

    private static Validator validator;
    private static AutoCloseable validatorFactory;

    @BeforeAll
    static void setUpValidator() {
        var factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        validatorFactory = factory;
    }

    @AfterAll
    static void closeValidatorFactory() throws Exception {
        validatorFactory.close();
    }

    @Test
    void acceptsValidUpdateRequest() {
        AdminIncomeUpdateRequest request = validRequest();

        assertThat(validator.validate(request)).isEmpty();
    }

    @Test
    void rejectsInvalidRequiredFieldsAndCategory() {
        AdminIncomeUpdateRequest request = new AdminIncomeUpdateRequest();
        request.setSource(" ");
        request.setAmount(BigDecimal.ZERO);
        request.setDate(LocalDate.now().plusDays(1));
        request.setCategoryId(0L);

        assertThat(violationsFor(request))
                .contains("source", "amount", "date", "categoryId");
    }

    private AdminIncomeUpdateRequest validRequest() {
        AdminIncomeUpdateRequest request = new AdminIncomeUpdateRequest();
        request.setSource("Updated salary");
        request.setAmount(new BigDecimal("1200.00"));
        request.setDate(LocalDate.now());
        request.setNote("Updated note");
        request.setCategoryId(8L);
        return request;
    }

    private Set<String> violationsFor(AdminIncomeUpdateRequest request) {
        Set<String> paths = new HashSet<>();
        validator.validate(request).forEach(violation ->
                paths.add(violation.getPropertyPath().toString()));
        return paths;
    }
}
