import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // Load all categories
  public categories() {
    return this.http.get(`${this.baseUrl}/category/`);
  }

  // Add a new category
  public addCategory(category: any) {
    return this.http.post(`${this.baseUrl}/category/`, category);
  }
}