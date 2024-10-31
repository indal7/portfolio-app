import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Project, ApiResponse } from '../project.model';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service'; // Import AuthService

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  @Input() projects: Project[] = [];
  apiUrl = environment.apiUrl;
  isAdmin: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toasterService: ToasterService,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.getProjects();
    if (this.authService.isAdmin()) {
      this.isAdmin = true;
      // Show admin-specific content
    }
  }
  
  getProjects(): void {
    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      this.toasterService.error('You must be logged in to view projects.');
      this.router.navigate(['/login']); // Redirect to login
      return;
    }

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
    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      this.toasterService.error('You must be logged in to delete a project.');
      this.router.navigate(['/login']); // Redirect to login
      return;
    }

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
