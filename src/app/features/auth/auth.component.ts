import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterDto, LoginDto } from '../../shared/models/user.model';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, VerifyEmailComponent],
})
export class AuthComponent {
  isSignUp = false;
  showSignUpPassword = false;
  showConfirmPassword = false;
  showSignInPassword = false;
  isLoading = false;
  errorMessage: string | null = null;

  showResendAfterLogin = false;
  showVerifyEmail = false; // Thêm để hiển thị VerifyEmailComponent
  resendEmail: string = '';

  signUpData: RegisterDto & { confirmPassword: string } = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  signInData: LoginDto = {
    username: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.isSignUp = params['mode'] === 'signup';
    });
  }

  toggleForm(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.isSignUp = !this.isSignUp;
    this.errorMessage = null;
    this.showResendAfterLogin = false;
    this.showVerifyEmail = false;
  }

  togglePassword(field: string) {
    if (field === 'signup') {
      this.showSignUpPassword = !this.showSignUpPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    } else if (field === 'signin') {
      this.showSignInPassword = !this.showSignInPassword;
    }
  }

  onSignUp(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Vui lòng điền đầy đủ và đúng thông tin';
      return;
    }

    if (this.signUpData.password !== this.signUpData.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { confirmPassword, ...registerDto } = this.signUpData;
    this.authService.register(registerDto).subscribe({
      next: () => {
        this.isLoading = false;
        this.showVerifyEmail = true; // Hiển thị VerifyEmailComponent
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
      },
    });
  }

  onSignIn(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.signInData).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        const errorMsg = this.getErrorMessage(err);
        this.errorMessage = errorMsg;
        if (errorMsg.includes('email chưa được xác minh')) {
          this.showResendAfterLogin = true;
          this.resendEmail = '';
        }
      },
    });
  }

  onResendVerification(email: string): void {
    if (!email) {
      this.errorMessage = 'Vui lòng nhập email để gửi lại xác minh';
      return;
    }
    this.authService.resendVerification(email).subscribe({
      next: () => {
        this.errorMessage = 'Email xác minh đã được gửi lại!';
        this.showVerifyEmail = true; // Hiển thị VerifyEmailComponent
      },
      error: (err) => {
        this.errorMessage = this.getErrorMessage(err);
      },
    });
  }

  onForgotPassword(): void {
    const email = prompt('Nhập email của bạn để đặt lại mật khẩu:');
    if (email) {
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.errorMessage = 'Link đặt lại mật khẩu đã được gửi đến email của bạn.';
        },
        error: (err) => {
          this.errorMessage = this.getErrorMessage(err);
        },
      });
    }
  }

  onVerified(): void {
    this.showVerifyEmail = false;
    this.toggleForm(); // Chuyển sang form đăng nhập
  }

  onVerifyClosed(): void {
    this.showVerifyEmail = false;
    this.errorMessage = null;
  }

  private getErrorMessage(err: any): string {
    const backendMessage = err.error?.message || '';
    if (backendMessage.includes('email chưa được xác minh')) {
      return 'Bạn chưa xác minh tài khoản.';
    } else if (err.status === 401) {
      return 'Tên người dùng hoặc mật khẩu không đúng';
    } else if (err.status === 400) {
      return backendMessage || 'Dữ liệu không hợp lệ';
    } else {
      return backendMessage || 'Đã xảy ra lỗi';
    }
  }
}