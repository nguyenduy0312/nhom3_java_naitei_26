package vn.naitei.nhom3.expensemanagement.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeFilterRequest;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomePageResponse;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeResponse;
import vn.naitei.nhom3.expensemanagement.entity.Category;
import vn.naitei.nhom3.expensemanagement.entity.Income;
import vn.naitei.nhom3.expensemanagement.entity.User;
import vn.naitei.nhom3.expensemanagement.entity.enums.CategoryType;
import vn.naitei.nhom3.expensemanagement.exception.ResourceNotFoundException;
import vn.naitei.nhom3.expensemanagement.repository.IncomeRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IncomeAdminServiceImplTest {

    @Mock
    private IncomeRepository incomeRepository;

    @InjectMocks
    private IncomeAdminServiceImpl incomeAdminService;

    @Test
    void getAllSystemPassesPaginationAndDefaultSortAndMapsAdminFields() {
        Income income = validIncome();
        when(incomeRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(income)));

        AdminIncomePageResponse result = incomeAdminService.getAllSystem(filter(1, 2, null));

        ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
        verify(incomeRepository).findAll(any(Specification.class), pageable.capture());
        assertThat(pageable.getValue().getPageNumber()).isEqualTo(1);
        assertThat(pageable.getValue().getPageSize()).isEqualTo(2);
        assertThat(pageable.getValue().getSort()).containsExactly(
                new Sort.Order(Sort.Direction.DESC, "incomeDate"),
                new Sort.Order(Sort.Direction.DESC, "id"));
        assertThat(result.getItems()).hasSize(1);
        AdminIncomeResponse item = result.getItems().get(0);
        assertThat(item.getSource()).isEqualTo("Salary");
        assertThat(item.getCategoryName()).isEqualTo("Income");
        assertThat(item.getUserEmail()).isEqualTo("user@example.com");
    }

    @Test
    void getAllSystemPassesExplicitSort() {
        when(incomeRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));

        incomeAdminService.getAllSystem(filter(0, 10, "amount,asc"));

        ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
        verify(incomeRepository).findAll(any(Specification.class), pageable.capture());
        assertThat(pageable.getValue().getSort()).containsExactly(
                new Sort.Order(Sort.Direction.ASC, "amount"),
                new Sort.Order(Sort.Direction.DESC, "id"));
    }

    @Test
    void getByIdReadsIncomeWithoutUserRestriction() {
        Income income = validIncome();
        when(incomeRepository.findById(7L)).thenReturn(Optional.of(income));

        AdminIncomeResponse result = incomeAdminService.getById(7L);

        verify(incomeRepository).findById(7L);
        assertThat(result.getUserId()).isEqualTo(3L);
    }

    @Test
    void getByIdThrowsForMissingIncome() {
        when(incomeRepository.findById(7L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> incomeAdminService.getById(7L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    private AdminIncomeFilterRequest filter(int page, int size, String sort) {
        AdminIncomeFilterRequest filter = new AdminIncomeFilterRequest();
        filter.setPage(page);
        filter.setSize(size);
        filter.setSort(sort);
        return filter;
    }

    private Income validIncome() {
        User user = new User();
        user.setId(3L);
        user.setName("Test user");
        user.setEmail("user@example.com");

        Category category = new Category();
        category.setId(5L);
        category.setName("Income");
        category.setType(CategoryType.INCOME);

        Income income = new Income();
        income.setId(7L);
        income.setUser(user);
        income.setCategory(category);
        income.setTitle("Salary");
        income.setAmount(new BigDecimal("1000.00"));
        income.setIncomeDate(LocalDate.of(2026, 8, 1));
        return income;
    }
}
