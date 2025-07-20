import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItineraryItem, Tour, FilterParams } from '../../shared/models/tour.model';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private apiUrl = 'http://localhost:3000'; // URL của NestJS

  constructor(private http: HttpClient) {}

  getTours(params: {
    destination?: string;
    duration?: string;
    priceRange?: string;
  }): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}/tours`, { params });
  }

  getTour(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/tours/${id}`);
  }
}