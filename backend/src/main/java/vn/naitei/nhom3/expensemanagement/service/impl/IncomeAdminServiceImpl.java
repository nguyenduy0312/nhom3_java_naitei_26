package vn.naitei.nhom3.expensemanagement.service.impl;

import java.util.Locale;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeFilterRequest;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomePageResponse;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeResponse;
import vn.naitei.nhom3.expensemanagement.dto.income.AdminIncomeUpdateRequest;
import vn.naitei.nhom3.expensemanagement.entity.Category;
import vn.naitei.nhom3.expensemanagement.entity.Income;
import vn.naitei.nhom3.expensemanagement.entity.enums.CategoryType;
import vn.naitei.nhom3.expensemanagement.exception.BadRequestException;
import vn.naitei.nhom3.expensemanagement.exception.ResourceNotFoundException;
import vn.naitei.nhom3.expensemanagement.repository.CategoryRepository;
import vn.naitei.nhom3.expensemanagement.repository.IncomeRepository;
import vn.naitei.nhom3.expensemanagement.repository.specification.IncomeSpecification;
import vn.naitei.nhom3.expensemanagement.service.IncomeAdminService;

@Service
@RequiredArgsConstructor
public class IncomeAdminServiceImpl implements IncomeAdminService {

    private static final Map<String, String> SORT_FIELDS = Map.of(
            "date", "incomeDate",
            "title", "title",
            "amount", "amount");

    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminIncomePageResponse getAllSystem(AdminIncomeFilterRequest filter) {
        Pageable pageable = PageRequest.of(
                filter.getPage(), filter.getSize(),
            createSort(filter.getSort()));
        Page<Income> incomes = incomeRepository.findAll(IncomeSpecification.filterByAdmin(filter), pageable);

        return new AdminIncomePageResponse(
                incomes.getContent().stream().map(this::toAdminResponse).toList(),
                incomes.getNumber(),
                incomes.getSize(),
                incomes.getTotalElements(),
                incomes.getTotalPages());
    }

    @Override
    @Transactional(readOnly = true)
    public AdminIncomeResponse getById(Long id) {
        return toAdminResponse(incomeRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Thu nhập", id)));
    }

    @Override
    @Transactional
    public AdminIncomeResponse update(Long id, AdminIncomeUpdateRequest request) {
        Income income = findIncome(id);
        income.setTitle(request.getSource().trim());
        income.setAmount(request.getAmount());
        income.setIncomeDate(request.getDate());
        income.setNote(request.getNote());

        if (request.getCategoryId() != null) {
            income.setCategory(validateCategory(income, request.getCategoryId()));
        }

        return toAdminResponse(incomeRepository.save(income));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        incomeRepository.delete(findIncome(id));
    }

    private AdminIncomeResponse toAdminResponse(Income income) {
        return new AdminIncomeResponse(
                income.getId(),
                income.getTitle(),
                income.getAmount(),
                income.getIncomeDate(),
                income.getNote(),
                income.getCategory().getId(),
                income.getCategory().getName(),
                income.getCreatedAt(),
                income.getUpdatedAt(),
                income.getUser().getId(),
                income.getUser().getName(),
                income.getUser().getEmail());
    }

    private Income findIncome(Long id) {
        return incomeRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Thu nhập", id));
    }

    private Category validateCategory(Income income, Long categoryId) {
        return categoryRepository.findVisibleToUserAndType(
                        income.getUser().getId(), CategoryType.INCOME).stream()
                .filter(category -> category.getId().equals(categoryId))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Danh mục thu nhập không hợp lệ"));
    }

    private Sort createSort(String sortParameter) {
        if (sortParameter == null || sortParameter.isBlank()) {
            return Sort.by(Sort.Order.desc("incomeDate"), Sort.Order.desc("id"));
        }
        String[] parts = sortParameter.split(",");
        String property = SORT_FIELDS.get(parts[0].toLowerCase(Locale.ROOT));
        Sort.Direction direction = Sort.Direction.fromString(parts[1]);
        return Sort.by(new Sort.Order(direction, property), Sort.Order.desc("id"));
    }
}