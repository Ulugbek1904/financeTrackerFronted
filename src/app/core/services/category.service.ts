import { CategoryDto } from './../../features/category/models/category.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../../features/category/models';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../shared/apiUrl';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl: string;
      constructor(api: ApiUrls, private http: HttpClient) {
        this.apiUrl = api.categoryUrl;
      }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/all`);
  }

  createCategory(categoryDto: CategoryDto): Observable<any>{
    return this.http.post(`${this.apiUrl}/create-category`,categoryDto);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateCategory(id:number, createDto: CategoryDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, createDto);
  }
}
