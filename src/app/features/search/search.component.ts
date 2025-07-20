// src/app/core/services/search.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Article } from '../../shared/models/article.model';

@Injectable({
  providedIn: 'root',
})
export class SearchComponent {
  private searchResultsSubject = new BehaviorSubject<Article[]>([]);
  public searchResults$ = this.searchResultsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  search(keyword: string): void {
    if (keyword.trim()) {
      this.apiService.searchArticles(keyword).subscribe({
        next: (results) => this.searchResultsSubject.next(results),
        error: (err) => console.error('Search error:', err),
      });
    } else {
      this.searchResultsSubject.next([]);
    }
  }
}