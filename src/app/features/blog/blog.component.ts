// src/app/features/blog/blog.component.ts
import { Component, signal, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DatePipe, SlicePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Article } from '../../shared/models/article.model';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink, DatePipe, SlicePipe, CommonModule, FormsModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  private readonly apiService = inject(ApiService);

  articles = signal<Article[]>([]);
  errorMessage = signal<string | null>(null);
  keyword = signal<string>('');
  isSearching = signal<boolean>(false);

  ngOnInit(): void {
    this.loadArticles();
  }

  private loadArticles(): void {
    this.isSearching.set(false);
    this.apiService.getLatestArticles(6).subscribe({
      next: (articles: Article[]) => {
        this.articles.set(articles);
        this.errorMessage.set(null);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
      }
    });
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.keyword.set(target.value);
    }
  }

  onSearch(): void {
    const trimmedKeyword = this.keyword().trim();
    if (trimmedKeyword) {
      this.isSearching.set(true);
      this.apiService.searchArticles(trimmedKeyword).subscribe({
        next: (results: Article[]) => {
          this.articles.set(results);
          if (results.length === 0) {
            this.errorMessage.set(`Không tìm thấy bài viết nào khớp với từ khóa "${trimmedKeyword}".`);
          } else {
            this.errorMessage.set(null);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set('Lỗi khi tìm kiếm. Vui lòng thử lại.');
          this.articles.set([]);
        },
        complete: () => this.isSearching.set(false)
      });
    } else {
      this.loadArticles();
    }
  }

  onClearSearch(): void {
    this.keyword.set('');
    this.loadArticles();
  }
}