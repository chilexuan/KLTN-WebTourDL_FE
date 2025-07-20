import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Comment } from '../../shared/models/comment.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  getCommentsByArticleId(articleId: number, page: number = 1, limit: number = 5): Observable<{ comments: Comment[]; total: number }> {
    return this.http
      .get<{ comments: Comment[]; total: number }>(`${this.baseUrl}/articles/${articleId}/comments?page=${page}&limit=${limit}`)
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể tải bình luận.');
          return throwError(() => new Error('Không thể tải bình luận.'));
        }),
      );
  }

  postComment(articleId: number, content: string): Observable<Comment> {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.toastr.error('Vui lòng đăng nhập lại.');
      return throwError(() => new Error('Vui lòng đăng nhập lại.'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http
      .post<Comment>(`${this.baseUrl}/articles/${articleId}/comments`, { content }, { headers })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể gửi bình luận.');
          return throwError(() => new Error('Không thể gửi bình luận.'));
        }),
      );
  }

  updateComment(articleId: number, commentId: number, content: string): Observable<Comment> {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.toastr.error('Vui lòng đăng nhập lại.');
      return throwError(() => new Error('Vui lòng đăng nhập lại.'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http
      .put<Comment>(`${this.baseUrl}/articles/${articleId}/comments/${commentId}`, { content }, { headers })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể cập nhật bình luận.');
          return throwError(() => new Error('Không thể cập nhật bình luận.'));
        }),
      );
  }

  deleteComment(articleId: number, commentId: number): Observable<void> {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.toastr.error('Vui lòng đăng nhập lại.');
      return throwError(() => new Error('Vui lòng đăng nhập lại.'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .delete<void>(`${this.baseUrl}/articles/${articleId}/comments/${commentId}`, { headers })
      .pipe(
        catchError((err) => {
          this.toastr.error(err.error.message || 'Không thể xóa bình luận.');
          return throwError(() => new Error('Không thể xóa bình luận.'));
        }),
      );
  }
}