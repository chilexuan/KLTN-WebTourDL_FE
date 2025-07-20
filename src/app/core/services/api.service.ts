import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Tour } from '../../shared/models/tour.model';
import { Location } from '../../shared/models/location.model';
import { Testimonial } from '../../shared/models/testimonial.model';
import { Article, CreateArticleDto, UpdateArticleDto } from '../../shared/models/article.model';
import { Comment } from '../../shared/models/comment.model';
import { User, UpdateUserDto, CreateUserDto } from '../../shared/models/user.model';
import { DashboardStats } from '../../shared/models/dashboard.model';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../shared/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly baseUrl = 'http://localhost:3000';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // Public APIs - Tours
  getPopularTours(limit: number = 6): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.baseUrl}/tours/popular?limit=${limit}`).pipe(
      catchError((err) => {
        this.toastr.error('Không thể lấy danh sách tour.');
        return throwError(() => new Error('Không thể lấy danh sách tour.'));
      }),
    );
  }

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.baseUrl}/tours`).pipe(
      catchError((err) => {
        this.toastr.error('Không thể lấy danh sách tour.');
        return throwError(() => new Error('Không thể lấy danh sách tour.'));
      }),
    );
  }

  getTourById(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.baseUrl}/tours/${id}`).pipe(
      catchError((err) => {
        this.toastr.error('Không thể lấy chi tiết tour.');
        return throwError(() => new Error('Không thể lấy chi tiết tour.'));
      }),
    );
  }

  createTour(tour: Partial<Tour>): Observable<Tour> {
    return this.http
      .post<Tour>(`${this.baseUrl}/tours`, tour, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể tạo tour.');
          return throwError(() => new Error('Không thể tạo tour.'));
        }),
      );
  }

  updateTour(id: number, tour: Partial<Tour>): Observable<Tour> {
    return this.http
      .put<Tour>(`${this.baseUrl}/tours/${id}`, tour, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể cập nhật tour.');
          return throwError(() => new Error('Không thể cập nhật tour.'));
        }),
      );
  }

  deleteTour(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/tours/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể xóa tour.');
          return throwError(() => new Error('Không thể xóa tour.'));
        }),
      );
  }

  // Other existing methods (unchanged)
  getPopularLocations(limit: number = 4): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.baseUrl}/locations/popular?limit=${limit}`).pipe(
      catchError((err) => {
        this.toastr.error('Không thể lấy danh sách địa điểm.');
        return throwError(() => new Error('Không thể lấy danh sách địa điểm.'));
      }),
    );
  }

  getLatestTestimonials(limit: number = 5): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.baseUrl}/testimonials/latest?limit=${limit}`).pipe(
      catchError((err) => {
        this.toastr.error('Không thể lấy danh sách đánh giá.');
        return throwError(() => new Error('Không thể lấy danh sách đánh giá.'));
      }),
    );
  }

  getLatestArticles(limit: number = 3): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/articles/latest?limit=${limit}`).pipe(
      catchError((err) => {
        this.toastr.error('Không thể lấy bài viết mới nhất.');
        return throwError(() => new Error('Không thể lấy bài viết mới nhất.'));
      }),
    );
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/articles/${id}`).pipe(
      catchError((err) => {
        this.toastr.error('Không thể lấy bài viết.');
        return throwError(() => new Error('Không thể lấy bài viết.'));
      }),
    );
  }

  getCommentsByArticleId(articleId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/articles/${articleId}/comments`).pipe(
      catchError((err) => {
        this.toastr.error('Không thể lấy bình luận.');
        return throwError(() => new Error('Không thể lấy bình luận.'));
      }),
    );
  }

  postComment(articleId: number, content: string): Observable<Comment> {
    return this.http
      .post<Comment>(`${this.baseUrl}/articles/${articleId}/comments`, { content }, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error('Không thể gửi bình luận.');
          return throwError(() => new Error('Không thể gửi bình luận.'));
        }),
      );
  }

  searchArticles(keyword: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/articles/search?q=${encodeURIComponent(keyword)}`).pipe(
      catchError((err) => {
        this.toastr.error('Không thể tìm kiếm bài viết.');
        return throwError(() => new Error('Không thể tìm kiếm bài viết.'));
      }),
    );
  }

  createArticle(dto: CreateArticleDto): Observable<Article> {
    return this.http
      .post<Article>(`${this.baseUrl}/admin/articles`, dto, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể tạo bài viết.');
          return throwError(() => new Error('Không thể tạo bài viết.'));
        }),
      );
  }

  getAdminArticles(): Observable<Article[]> {
    return this.http
      .get<Article[]>(`${this.baseUrl}/admin/articles`, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể lấy danh sách bài viết.');
          return throwError(() => new Error('Không thể lấy danh sách bài viết.'));
        }),
      );
  }

  updateArticle(id: number, dto: UpdateArticleDto): Observable<Article> {
    return this.http
      .put<Article>(`${this.baseUrl}/admin/articles/${id}`, dto, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể cập nhật bài viết.');
          return throwError(() => new Error('Không thể cập nhật bài viết.'));
        }),
      );
  }

  deleteArticle(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/admin/articles/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể xóa bài viết.');
          return throwError(() => new Error('Không thể xóa bài viết.'));
        }),
      );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http
      .get<DashboardStats>(`${this.baseUrl}/admin/dashboard`, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể lấy số liệu thống kê.');
          return throwError(() => new Error('Không thể lấy số liệu thống kê.'));
        }),
      );
  }

  getUserProfile(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error('Không thể lấy thông tin người dùng.');
          return throwError(() => new Error('Không thể lấy thông tin người dùng.'));
        }),
      );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`).pipe(
      catchError((err) => {
        this.toastr.error('Không thể lấy danh sách danh mục.');
        return throwError(() => new Error('Không thể lấy danh sách danh mục.'));
      }),
    );
  }

  updateUserProfile(id: number, profile: { email?: string; password?: string; currentPassword?: string }): Observable<User> {
    return this.http
      .put<User>(`${this.baseUrl}/users/${id}`, profile, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error('Không thể cập nhật thông tin người dùng.');
          return throwError(() => new Error('Không thể cập nhật thông tin người dùng.'));
        }),
      );
  }

  uploadFile(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<{ url: string }>(`${this.baseUrl}/upload`, formData, { headers: this.getHeaders().delete('Content-Type') })
      .pipe(
        catchError((err) => {
          this.toastr.error('Không thể tải ảnh lên.');
          return throwError(() => new Error('Không thể tải ảnh lên.'));
        }),
      );
  }

  getAdminUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseUrl}/admin/users`, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error('Không thể lấy danh sách người dùng.');
          return throwError(() => new Error('Không thể lấy danh sách người dùng.'));
        }),
      );
  }

  updateUser(id: number, dto: UpdateUserDto): Observable<User> {
    return this.http
      .put<User>(`${this.baseUrl}/${id}`, dto, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể cập nhật người dùng.');
          return throwError(() => new Error('Không thể cập nhật người dùng.'));
        }),
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/admin/users/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error('Không thể xóa người dùng.');
          return throwError(() => new Error('Không thể xóa người dùng.'));
        }),
      );
  }

  createUser(dto: CreateUserDto): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/admin/users`, dto, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể tạo người dùng.');
          return throwError(() => new Error('Không thể tạo người dùng.'));
        }),
      );
  }
}