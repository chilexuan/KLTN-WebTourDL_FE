import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterDto, LoginDto } from '../../shared/models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AuthComponent {
  isSignUp = false;
  showSignUpPassword = false;
  showConfirmPassword = false;
  showSignInPassword = false;
  isLoading = false;
  errorMessage: string | null = null;

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
        this.authService.login({ username: registerDto.username, password: registerDto.password }).subscribe({
          next: () => {
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = this.getErrorMessage(err);
          },
        });
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
        this.errorMessage = this.getErrorMessage(err);
      },
    });
  }

  private getErrorMessage(err: any): string {
    if (err.status === 401) {
      return 'Tên người dùng hoặc mật khẩu không đúng';
    } else if (err.status === 400) {
      return 'Tên người dùng hoặc mật khẩu không đúng';
    } else {
      return 'Tên người dùng hoặc mật khẩu không đúng';
    }
  }
}