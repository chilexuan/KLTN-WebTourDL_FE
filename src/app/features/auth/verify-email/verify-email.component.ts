import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class VerifyEmailComponent {
  @Input() email: string = '';
  @Output() verified = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  otpCode: string = '';
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService) {}

  onVerifyOtp(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Vui lòng nhập mã OTP';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.verifyCode(this.email, this.otpCode).subscribe({
      next: () => {
        this.isLoading = false;
        this.verified.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
      },
    });
  }

  onResendVerification(): void {
    if (!this.email) {
      this.errorMessage = 'Vui lòng cung cấp email';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.resendVerification(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.errorMessage = 'Mã xác minh đã được gửi lại!';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
      },
    });
  }

  onClose(): void {
    this.closed.emit();
  }

  private getErrorMessage(err: any): string {
    const backendMessage = err.error?.message || '';
    if (backendMessage.includes('email chưa được xác minh')) {
      return 'Bạn chưa xác minh tài khoản.';
    } else if (err.status === 400) {
      return backendMessage || 'Mã không hợp lệ hoặc hết hạn.';
    } else {
      return backendMessage || 'Đã xảy ra lỗi.';
    }
  }
}