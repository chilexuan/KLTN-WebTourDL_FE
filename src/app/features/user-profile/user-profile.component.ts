import { Component, inject, signal, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators, 
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  userProfileForm!: FormGroup;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  userId = signal<number | null>(null);
  originalFormData: any = {};

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.checkAuthenticationAndLoadProfile();
  }

  /**
   * Initialize the reactive form with validation rules
   */
  private initializeForm(): void {
    this.userProfileForm = this.fb.group({
      username: [
        { value: '', disabled: true }, 
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      email: [
        '', 
        [Validators.required, Validators.email]
      ],
      role: [
        { value: '', disabled: true }, 
        [Validators.required]
      ],
      currentPassword: [''],
      newPassword: [
        '', 
        [Validators.minLength(6), Validators.maxLength(100)]
      ],
      confirmPassword: ['']
    }, { 
      validators: [this.passwordMatchValidator, this.currentPasswordRequiredValidator] 
    });

    // Subscribe to form value changes for dynamic validation
    this.userProfileForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.userProfileForm.get('confirmPassword')?.updateValueAndValidity();
      this.userProfileForm.get('currentPassword')?.updateValueAndValidity();
    });

    this.userProfileForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.userProfileForm.updateValueAndValidity();
    });
  }

  /**
   * Check if user is authenticated and load profile data
   */
  private checkAuthenticationAndLoadProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      this.handleAuthenticationError();
      return;
    }

    this.userId.set(currentUser.id);
    this.loadUserProfile();
  }

  /**
   * Handle authentication error
   */
  private handleAuthenticationError(): void {
    this.errorMessage.set('Vui lòng đăng nhập để truy cập trang này.');
    this.toastr.error('Bạn chưa đăng nhập.', 'Lỗi xác thực');
    this.router.navigate(['/login']);
  }

  /**
   * Load user profile data from API
   */
  loadUserProfile(): void {
    const userId = this.userId();
    if (!userId) {
      this.handleAuthenticationError();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.apiService.getUserProfile(userId).subscribe({
      next: (user: User) => {
        this.populateForm(user);
        this.storeOriginalData(user);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.handleLoadError(error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Populate form with user data
   */
  private populateForm(user: User): void {
    this.userProfileForm.patchValue({
      username: user.username,
      email: user.email,
      role: user.role
    });
  }

  /**
   * Store original form data for comparison
   */
  private storeOriginalData(user: User): void {
    this.originalFormData = {
      username: user.username,
      email: user.email,
      role: user.role
    };
  }

  /**
   * Handle profile loading error
   */
  private handleLoadError(error: HttpErrorResponse): void {
    const errorMsg = error.error?.message || 'Không thể tải thông tin người dùng. Vui lòng thử lại.';
    this.errorMessage.set(errorMsg);
    this.toastr.error('Không thể tải thông tin người dùng.', 'Lỗi');
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.userProfileForm.invalid) {
      this.markAllFieldsAsTouched();
      this.toastr.warning('Vui lòng kiểm tra lại thông tin đã nhập.', 'Dữ liệu không hợp lệ');
      return;
    }

    const userId = this.userId();
    if (!userId) {
      this.handleAuthenticationError();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const updatedProfile = this.buildUpdatePayload();
    
    this.apiService.updateUserProfile(userId, updatedProfile).subscribe({
      next: (response: User) => {
        this.handleUpdateSuccess();
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.handleUpdateError(error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Build update payload based on form changes
   */
  private buildUpdatePayload(): any {
    const formValue = this.userProfileForm.value;
    const updatedProfile: any = {};

    // Always include email if changed
    if (formValue.email !== this.originalFormData.email) {
      updatedProfile.email = formValue.email;
    }

    // Include password fields if new password is provided
    if (formValue.newPassword) {
      updatedProfile.currentPassword = formValue.currentPassword;
      updatedProfile.password = formValue.newPassword;
    }

    return updatedProfile;
  }

  /**
   * Handle successful profile update
   */
  private handleUpdateSuccess(): void {
    this.toastr.success('Cập nhật thông tin thành công!', 'Thành công');
    this.clearPasswordFields();
    this.updateOriginalData();
  }

  /**
   * Handle profile update error
   */
  private handleUpdateError(error: HttpErrorResponse): void {
    const errorMsg = error.error?.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
    this.errorMessage.set(errorMsg);
    this.toastr.error('Có lỗi xảy ra khi cập nhật thông tin.', 'Lỗi');
  }

  /**
   * Clear password fields after successful update
   */
  private clearPasswordFields(): void {
    this.userProfileForm.patchValue({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // Clear validation states
    ['currentPassword', 'newPassword', 'confirmPassword'].forEach(field => {
      const control = this.userProfileForm.get(field);
      control?.markAsUntouched();
      control?.markAsPristine();
    });
  }

  /**
   * Update original data after successful save
   */
  private updateOriginalData(): void {
    const formValue = this.userProfileForm.value;
    this.originalFormData = {
      username: formValue.username,
      email: formValue.email,
      role: formValue.role
    };
  }

  /**
   * Reset form to original state
   */
  resetForm(): void {
    this.userProfileForm.patchValue({
      username: this.originalFormData.username,
      email: this.originalFormData.email,
      role: this.originalFormData.role,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    // Reset validation states
    this.userProfileForm.markAsUntouched();
    this.userProfileForm.markAsPristine();
    this.errorMessage.set(null);
    
    this.toastr.info('Form đã được đặt lại về trạng thái ban đầu.', 'Thông báo');
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.userProfileForm.controls).forEach(key => {
      const control = this.userProfileForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Cross-field validator: Password confirmation must match new password
   */
  private passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    }

    // Clear mismatch error if passwords match
    const confirmControl = formGroup.get('confirmPassword');
    if (confirmControl?.errors?.['mismatch']) {
      delete confirmControl.errors['mismatch'];
      if (Object.keys(confirmControl.errors).length === 0) {
        confirmControl.setErrors(null);
      }
    }

    return null;
  }

  /**
   * Cross-field validator: Current password required when new password is provided
   */
  private currentPasswordRequiredValidator(formGroup: AbstractControl): ValidationErrors | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const currentPassword = formGroup.get('currentPassword')?.value;

    if (newPassword && !currentPassword) {
      formGroup.get('currentPassword')?.setErrors({ required: true });
      return { currentPasswordRequired: true };
    }

    // Clear required error if current password is provided
    const currentControl = formGroup.get('currentPassword');
    if (currentControl?.errors?.['required'] && currentPassword) {
      delete currentControl.errors['required'];
      if (Object.keys(currentControl.errors).length === 0) {
        currentControl.setErrors(null);
      }
    }

    return null;
  }

  // Getter methods for easy access to form controls
  get username() { 
    return this.userProfileForm.get('username'); 
  }
  
  get email() { 
    return this.userProfileForm.get('email'); 
  }
  
  get role() { 
    return this.userProfileForm.get('role'); 
  }
  
  get currentPassword() { 
    return this.userProfileForm.get('currentPassword'); 
  }
  
  get newPassword() { 
    return this.userProfileForm.get('newPassword'); 
  }
  
  get confirmPassword() { 
    return this.userProfileForm.get('confirmPassword'); 
  }

  /**
   * Check if form has unsaved changes
   */
  hasUnsavedChanges(): boolean {
    const currentEmail = this.userProfileForm.get('email')?.value;
    const hasPasswordChanges = this.userProfileForm.get('newPassword')?.value;
    
    return currentEmail !== this.originalFormData.email || !!hasPasswordChanges;
  }

  /**
   * Get form validation summary
   */
  getValidationSummary(): string[] {
    const errors: string[] = [];
    
    if (this.username?.invalid && this.username?.touched) {
      errors.push('Tên đăng nhập không hợp lệ');
    }
    
    if (this.email?.invalid && this.email?.touched) {
      errors.push('Email không hợp lệ');
    }
    
    if (this.newPassword?.invalid && this.newPassword?.touched) {
      errors.push('Mật khẩu mới phải có ít nhất 6 ký tự');
    }
    
    if (this.confirmPassword?.invalid && this.confirmPassword?.touched) {
      errors.push('Xác nhận mật khẩu không khớp');
    }
    
    if (this.currentPassword?.invalid && this.currentPassword?.touched) {
      errors.push('Mật khẩu hiện tại là bắt buộc');
    }
    
    return errors;
  }
}