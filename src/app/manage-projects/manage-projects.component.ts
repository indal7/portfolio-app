// src/app/manage-projects/manage-projects.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Project, ApiResponse } from '../project.model';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.css']
})
export class ManageProjectsComponent implements OnInit {
  projects: Project[] = [];
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(): void {
    const email = localStorage.getItem('userEmail');
    let params = new HttpParams();

    if (email) {
      params = params.set('email', email);
    }

    this.http.get<ApiResponse>(`${this.apiUrl}/projects`, { params }).subscribe(
      response => {
        if (response.success) {
          this.projects = response.data || [];
          this.toasterService.success('Projects loaded successfully!');
        } else {
          this.toasterService.error(response.message || 'Error fetching projects.');
        }
      },
      error => {
        console.error('Error fetching projects:', error);
        this.toasterService.error('Failed to load projects. Please try again.');
      }
    );
  }

  updateProject(project: Project): void {
    this.router.navigate(['edit-project', project.id]);
  }

  deleteProject(id: string): void {
    const email = localStorage.getItem('userEmail');

    if (!email) {
      this.toasterService.error('Email is missing');
      return;
    }

    let params = new HttpParams().set('email', email);

    this.http.delete<ApiResponse>(`${this.apiUrl}/projects/${id}`, { params }).subscribe(
      response => {
        if (response.success) {
          this.toasterService.success('Project deleted successfully!');
          this.getProjects(); // Refresh list after deleting
        } else {
          this.toasterService.error(response.message || 'Error deleting project.');
        }
      },
      error => {
        console.error('Error deleting project:', error);
        this.toasterService.error('Failed to delete project. Please try again.');
      }
    );
  }

  addMoreProject(): void {
    this.router.navigate(['/create-project']);
  }
}
