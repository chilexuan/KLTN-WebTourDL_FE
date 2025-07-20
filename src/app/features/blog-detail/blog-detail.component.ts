import { Component, signal, inject, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { CommentsService } from '../../core/services/comments.service';
import { Article } from '../../shared/models/article.model';
import { Comment } from '../../shared/models/comment.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
})
export class BlogDetailComponent {
  readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly commentsService = inject(CommentsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  article = signal<Article | null>(null);
  comments = signal<Comment[]>([]);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  loadingComments = signal<boolean>(false);
  newComment = signal<string>('');
  editingCommentId = signal<number | null>(null);
  editingContent = signal<string>('');
  currentPage = signal<number>(1);
  totalComments = signal<number>(0);
  limit: number = 5;
  currentUserId = signal<number | null>(null);
  activeMenuId = signal<number | null>(null);

  get isCommentValid(): boolean {
    return this.newComment().trim().length > 0;
  }

  get isEditingCommentValid(): boolean {
    return this.editingContent().trim().length > 0;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.comment-menu')) {
      this.activeMenuId.set(null);
    }
  }

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.loadArticle(+articleId);
      this.loadComments(+articleId);
    } else {
      this.errorMessage.set('Không tìm thấy bài viết.');
    }
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.currentUserId.set(user ? user.id : null);
    });
  }

  private loadArticle(id: number): void {
    this.apiService.getArticleById(id).subscribe({
      next: (article) => this.article.set(article),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.status === 404 ? 'Bài viết không tồn tại.' : 'Không thể tải bài viết.');
      },
    });
  }

  private loadComments(articleId: number): void {
    this.loadingComments.set(true);
    this.commentsService.getCommentsByArticleId(articleId, this.currentPage(), this.limit).subscribe({
      next: ({ comments, total }) => {
        this.comments.update((existing) => [...existing, ...comments]);
        this.totalComments.set(total);
        this.loadingComments.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set('Không thể tải bình luận.');
        this.loadingComments.set(false);
      },
    });
  }

  loadMoreComments(): void {
    if (this.comments().length < this.totalComments()) {
      this.currentPage.update((page) => page + 1);
      const articleId = this.route.snapshot.paramMap.get('id');
      if (articleId) {
        this.loadComments(+articleId);
      }
    }
  }

  toggleCommentMenu(commentId: number): void {
    if (this.activeMenuId() === commentId) {
      this.activeMenuId.set(null);
    } else {
      this.activeMenuId.set(commentId);
    }
  }

  onSubmitComment(): void {
    if (!this.isCommentValid) {
      this.errorMessage.set('Vui lòng nhập nội dung bình luận.');
      return;
    }

    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId && this.authService.isLoggedIn()) {
      this.commentsService.postComment(+articleId, this.newComment()).subscribe({
        next: (comment) => {
          this.comments.update((comments) => [comment, ...comments]);
          this.newComment.set('');
          this.successMessage.set('Bình luận đã được gửi!');
          this.article.update((a) => (a ? { ...a, comment_count: a.comment_count + 1 } : a));
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(error.status === 401 ? 'Vui lòng đăng nhập lại.' : 'Không thể gửi bình luận.');
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        },
      });
    } else {
      this.errorMessage.set('Vui lòng đăng nhập.');
      this.router.navigate(['/login']);
    }
  }

  startEditComment(comment: Comment): void {
    if (comment.user.id !== this.currentUserId()) {
      this.errorMessage.set('Bạn không có quyền chỉnh sửa bình luận này.');
      return;
    }
    this.editingCommentId.set(comment.id);
    this.editingContent.set(comment.content);
    this.activeMenuId.set(null); // Đóng menu
  }

  updateComment(): void {
    if (!this.isEditingCommentValid) {
      this.errorMessage.set('Vui lòng nhập nội dung bình luận.');
      return;
    }
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId && this.editingCommentId()) {
      this.commentsService.updateComment(+articleId, this.editingCommentId()!, this.editingContent()).subscribe({
        next: (updatedComment) => {
          this.comments.update((comments) =>
            comments.map((c) => (c.id === updatedComment.id ? updatedComment : c)),
          );
          this.cancelEdit();
          this.successMessage.set('Bình luận đã được cập nhật!');
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(
            error.status === 401
              ? 'Vui lòng đăng nhập lại.'
              : error.status === 403
              ? 'Bạn không có quyền chỉnh sửa.'
              : 'Không thể cập nhật bình luận.',
          );
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        },
      });
    }
  }

  cancelEdit(): void {
    this.editingCommentId.set(null);
    this.editingContent.set('');
  }

  deleteComment(commentId: number): void {
    this.activeMenuId.set(null); // Đóng menu trước
    
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      return;
    }
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.commentsService.deleteComment(+articleId, commentId).subscribe({
        next: () => {
          this.comments.update((comments) => comments.filter((c) => c.id !== commentId));
          this.article.update((a) => (a ? { ...a, comment_count: a.comment_count - 1 } : a));
          this.successMessage.set('Bình luận đã được xóa!');
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(
            error.status === 401
              ? 'Vui lòng đăng nhập lại.'
              : error.status === 403
              ? 'Bạn không có quyền xóa.'
              : 'Không thể xóa bình luận.',
          );
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        },
      });
    }
  }
}