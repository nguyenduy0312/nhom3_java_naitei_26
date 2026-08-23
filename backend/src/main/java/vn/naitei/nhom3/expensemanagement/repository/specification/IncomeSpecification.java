package vn.naitei.nhom3.expensemanagement.repository.specification;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeFilterRequest;
import vn.naitei.nhom3.expensemanagement.entity.Income;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public final class IncomeSpecification {

    private IncomeSpecification() {
    }

    public static Specification<Income> filterByAdmin(AdminIncomeFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addOptionalPredicate(predicates, filter.getUserId(),
                    value -> criteriaBuilder.equal(root.get("user").get("id"), value));
            addOptionalPredicate(predicates, filter.getCategoryId(),
                    value -> criteriaBuilder.equal(root.get("category").get("id"), value));
            addOptionalPredicate(predicates, filter.getFromDate(),
                    value -> criteriaBuilder.greaterThanOrEqualTo(root.get("incomeDate"), value));
            addOptionalPredicate(predicates, filter.getToDate(),
                    value -> criteriaBuilder.lessThanOrEqualTo(root.get("incomeDate"), value));

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static <T> void addOptionalPredicate(
            List<Predicate> predicates,
            T value,
            Function<T, Predicate> predicateFactory) {
        if (value != null) {
            predicates.add(predicateFactory.apply(value));
        }
    }
}