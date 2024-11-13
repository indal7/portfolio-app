// src/app/services/project.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project, ApiResponse } from '../project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProjectById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/projects/${id}`);
  }

  getAllProjects(email: string): Observable<ApiResponse> {
    let params = new HttpParams().set('email', email);
    return this.http.get<ApiResponse>(`${this.apiUrl}/projects`, { params });
  }

  createProject(project: Project): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/projects`, project, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateProject(project: Project): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/projects/${project.id}`, project);
  }

  deleteProject(id: string, email: string): Observable<ApiResponse> {
    let params = new HttpParams().set('email', email);
    return this.http.delete<ApiResponse>(`${this.apiUrl}/projects/${id}`, { params });
  }
}
