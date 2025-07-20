import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginResponse, LoginDto, RegisterDto } from '../../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadTokens();
  }

  private loadTokens(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
      const user = localStorage.getItem('currentUser');
      if (user) {
        console.log('Loaded currentUser from localStorage:', JSON.parse(user));
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, dto).pipe(
      tap(() => this.toastr.success('Đăng ký thành công! Vui lòng đăng nhập.')),
      catchError((err) => {
        this.toastr.error(err.error.message || 'Đăng ký thất bại.');
        return throwError(() => new Error(err.error.message || 'Đăng ký thất bại.'));
      })
    );
  }

  login(dto: LoginDto): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, dto)
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
          this.accessToken = response.accessToken;
          this.refreshToken = response.refreshToken || null;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('accessToken', response.accessToken);
            if (response.refreshToken) {
              localStorage.setItem('refreshToken', response.refreshToken);
            }
          }
          this.getProfile().subscribe({
            next: (user: User) => {
              console.log('Profile data:', user);
              this.currentUserSubject.next(user);
              if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('currentUser', JSON.stringify(user));
              }
              this.toastr.success('Đăng nhập thành công!');
              if (user.role === 'admin') {
                this.router.navigate(['/admin/dashboard']);
              } else {
                this.router.navigate(['/']);
              }
            },
            error: (err: HttpErrorResponse) => {
              console.error('Get profile error:', err);
              this.toastr.error('Không thể lấy thông tin người dùng.');
              this.logout();
            },
          });
        }),
        catchError((err) => {
          this.toastr.error(err.error.message || 'Đăng nhập thất bại.');
          return throwError(() => new Error(err.error.message || 'Đăng nhập thất bại.'));
        })
      );
  }

  refreshAccessToken(): Observable<{ accessToken: string }> {
    if (!this.refreshToken) {
      this.logout();
      return throwError(() => new Error('Không có refresh token.'));
    }
    return this.http
      .post<{ accessToken: string }>(`${this.baseUrl}/refresh`, { refreshToken: this.refreshToken })
      .pipe(
        tap((response) => {
          this.accessToken = response.accessToken;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('accessToken', response.accessToken);
          }
        }),
        catchError((err) => {
          this.toastr.error('Không thể làm mới token.');
          this.logout();
          return throwError(() => new Error('Không thể làm mới token.'));
        })
      );
  }

  getProfile(): Observable<User> {
    const token = this.getAccessToken();
    console.log('Using accessToken:', token);
    if (!token) {
      return throwError(() => new Error('Không có access token.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User>(`${this.baseUrl}/me`, { headers }).pipe(
      catchError((err) => {
        this.toastr.error('Không thể lấy thông tin người dùng.');
        return throwError(() => new Error('Không thể lấy thông tin người dùng.'));
      })
    );
  }

  logout(): void {
    const headers = this.accessToken
      ? new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` })
      : undefined;
    this.http.post(`${this.baseUrl}/logout`, {}, { headers }).subscribe({
      next: () => {
        this.clearSession();
        this.toastr.info('Đã đăng xuất.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Logout error:', err);
        this.clearSession();
        this.toastr.info('Đã đăng xuất.');
      },
    });
  }

  private clearSession(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.currentUserSubject.next(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin' || false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
}