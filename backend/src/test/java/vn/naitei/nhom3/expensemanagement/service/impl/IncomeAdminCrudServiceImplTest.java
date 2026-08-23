package vn.naitei.nhom3.expensemanagement.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeUpdateRequest;
import vn.naitei.nhom3.expensemanagement.entity.Category;
import vn.naitei.nhom3.expensemanagement.entity.Income;
import vn.naitei.nhom3.expensemanagement.entity.User;
import vn.naitei.nhom3.expensemanagement.entity.enums.CategoryType;
import vn.naitei.nhom3.expensemanagement.exception.BadRequestException;
import vn.naitei.nhom3.expensemanagement.exception.ResourceNotFoundException;
import vn.naitei.nhom3.expensemanagement.repository.CategoryRepository;
import vn.naitei.nhom3.expensemanagement.repository.IncomeRepository;

@ExtendWith(MockitoExtension.class)
class IncomeAdminCrudServiceImplTest {

    @Mock
    private IncomeRepository incomeRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private IncomeAdminServiceImpl incomeAdminService;

    private Income income;
    private Category updatedCategory;

    @BeforeEach
    void setUp() {
        User owner = new User();
        owner.setId(4L);
        owner.setName("Income owner");
        owner.setEmail("owner@example.com");

        Category currentCategory = new Category();
        currentCategory.setId(8L);
        currentCategory.setName("Salary");
        currentCategory.setType(CategoryType.INCOME);

        updatedCategory = new Category();
        updatedCategory.setId(9L);
        updatedCategory.setName("Bonus");
        updatedCategory.setType(CategoryType.INCOME);

        income = new Income();
        income.setId(12L);
        income.setUser(owner);
        income.setCategory(currentCategory);
        income.setTitle("Salary");
        income.setAmount(new BigDecimal("1000.00"));
        income.setIncomeDate(LocalDate.of(2026, 8, 1));
        income.setNote("Old note");
    }

    @Test
    void updateChangesFieldsAndCategoryForAnotherUser() {
        when(incomeRepository.findById(12L)).thenReturn(Optional.of(income));
        when(categoryRepository.findVisibleToUserAndType(4L, CategoryType.INCOME))
                .thenReturn(List.of(updatedCategory));
        when(incomeRepository.save(income)).thenReturn(income);

        AdminIncomeUpdateRequest request = request(9L);
        var result = incomeAdminService.update(12L, request);

        assertThat(income.getTitle()).isEqualTo("Updated source");
        assertThat(income.getAmount()).isEqualByComparingTo("2500.00");
        assertThat(income.getIncomeDate()).isEqualTo(LocalDate.of(2026, 8, 15));
        assertThat(income.getNote()).isEqualTo("New note");
        assertThat(income.getCategory()).isSameAs(updatedCategory);
        assertThat(result.getUserId()).isEqualTo(4L);
        verify(incomeRepository).save(income);
    }

    @Test
    void updatePreservesCategoryWhenCategoryIsOmitted() {
        when(incomeRepository.findById(12L)).thenReturn(Optional.of(income));
        when(incomeRepository.save(income)).thenReturn(income);

        incomeAdminService.update(12L, request(null));

        assertThat(income.getCategory().getId()).isEqualTo(8L);
        verify(categoryRepository, org.mockito.Mockito.never())
                .findVisibleToUserAndType(any(), any());
    }

    @Test
    void updateRejectsCategoryNotVisibleToIncomeOwner() {
        when(incomeRepository.findById(12L)).thenReturn(Optional.of(income));
        when(categoryRepository.findVisibleToUserAndType(eq(4L), eq(CategoryType.INCOME)))
                .thenReturn(List.of());

        assertThatThrownBy(() -> incomeAdminService.update(12L, request(9L)))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void updateThrowsWhenIncomeDoesNotExist() {
        when(incomeRepository.findById(12L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> incomeAdminService.update(12L, request(null)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteRemovesAnotherUsersIncome() {
        when(incomeRepository.findById(12L)).thenReturn(Optional.of(income));

        incomeAdminService.delete(12L);

        verify(incomeRepository).delete(income);
    }

    @Test
    void deleteThrowsWhenIncomeDoesNotExist() {
        when(incomeRepository.findById(12L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> incomeAdminService.delete(12L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    private AdminIncomeUpdateRequest request(Long categoryId) {
        AdminIncomeUpdateRequest request = new AdminIncomeUpdateRequest();
        request.setSource("Updated source");
        request.setAmount(new BigDecimal("2500.00"));
        request.setDate(LocalDate.of(2026, 8, 15));
        request.setNote("New note");
        request.setCategoryId(categoryId);
        return request;
    }
}
