import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // Thay bằng URL của NestJS API

  constructor(private http: HttpClient) {}

  // Ví dụ: Gọi API GET để lấy danh sách dữ liệu
  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/your-endpoint`); // Thay 'your-endpoint' bằng endpoint cụ thể
  }
}