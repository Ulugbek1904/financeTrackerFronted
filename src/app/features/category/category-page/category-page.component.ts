import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { Category, CategoryDto } from '../models';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { MessageService } from 'primeng/api';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    CardModule,
    ToastModule,
    TableModule,
    CommonModule,
    CheckboxModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css', 
  providers: [MessageService]
})
export class CategoryPageComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isEditing = false;
  editingCategoryId: number | null = null;
  isLoading = true;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      isIncome: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showError('Failed to load categories: ' + this.getErrorMessage(error));
        this.isLoading = false;
        this.categories = [];
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const categoryDto: CategoryDto = this.categoryForm.value;

    if (this.isEditing && this.editingCategoryId) {
      this.updateCategory(this.editingCategoryId, categoryDto);
    } else {
      this.createCategory(categoryDto);
    }
  }

  createCategory(categoryDto: CategoryDto): void {
    this.categoryService.createCategory(categoryDto).subscribe({
      next: () => {
        this.showSuccess('Category created successfully');
        this.resetForm();
        this.loadCategories();
      },
      error: (error) => {
        this.showError('Failed to create category: ' + this.getErrorMessage(error));
        this.resetForm();
      }
    });
  }

  updateCategory(id: number, categoryDto: CategoryDto): void {
    this.categoryService.updateCategory(id, categoryDto).subscribe({
      next: () => {
        this.showSuccess('Category updated successfully');
        this.resetForm();
        this.loadCategories();
      },
      error: (error) => {
        this.showError('Failed to update category: ' + this.getErrorMessage(error));
      }
    });
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      isIncome: category.isIncome
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.showSuccess('Category deleted successfully');
          this.loadCategories();
        },
        error: (error) => {
          this.showError('Failed to delete category: ' + this.getErrorMessage(error));
        }
      });
    }
  }

  resetForm(): void {
    this.categoryForm.reset({ isIncome: false });
    this.isEditing = false;
    this.editingCategoryId = null;
  }

  showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Unauthorized access. Please log in as superAdmin';
    } else if (error.status === 404) {
      return 'Category not found.';
    } else if (error.status === 400) {
      return error.error.detail;
    } else {
      return 'An unexpected error occurred.';
    }
  }
}