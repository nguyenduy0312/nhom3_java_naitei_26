package vn.naitei.nhom3.expensemanagement.income;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeFilterRequest;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class AdminIncomeFilterRequestValidationTest {

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
    void acceptsSupportedSortFieldsAndDirections() {
        for (String field : new String[]{"date", "amount", "title"}) {
            for (String direction : new String[]{"asc", "desc"}) {
                AdminIncomeFilterRequest request = new AdminIncomeFilterRequest();
                request.setSort(field + "," + direction);

                assertThat(validator.validate(request)).isEmpty();
            }
        }
    }

    @Test
    void rejectsInvalidPaginationIdentifiersSortAndDateRange() {
        AdminIncomeFilterRequest request = new AdminIncomeFilterRequest();
        request.setPage(-1);
        request.setSize(101);
        request.setUserId(0L);
        request.setCategoryId(-1L);
        request.setSort("createdAt,asc");
        request.setFromDate(LocalDate.of(2026, 8, 20));
        request.setToDate(LocalDate.of(2026, 8, 1));

        assertThat(violationsFor(request))
                .contains("page", "size", "userId", "categoryId", "sort", "dateRangeValid");
    }

    @Test
    void acceptsEmptyFiltersAndValidDateRange() {
        AdminIncomeFilterRequest request = new AdminIncomeFilterRequest();
        request.setFromDate(LocalDate.of(2026, 8, 1));
        request.setToDate(LocalDate.of(2026, 8, 31));

        assertThat(validator.validate(request)).isEmpty();
    }

    private Set<String> violationsFor(AdminIncomeFilterRequest request) {
        Set<String> propertyPaths = new HashSet<>();
        validator.validate(request).forEach(violation ->
                propertyPaths.add(violation.getPropertyPath().toString()));
        return propertyPaths;
    }
}
