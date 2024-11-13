import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project, ApiResponse } from '../project.model';
import { ToasterService } from '../toaster.service';
import { AuthService } from '../auth.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  @Input() projects: Project[] = [];
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private toasterService: ToasterService,
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getProjects();
    if (this.authService.isAdmin()) {
      this.isAdmin = true;
    }
  }

  getProjects(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.projectService.getAllProjects(email).subscribe(
        (response: ApiResponse) => {
          if (response.success) {
            this.projects = Array.isArray(response.data) ? response.data : [];
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
  }

  updateProject(project: Project): void {
    this.router.navigate(['edit-project', project.id]);
  }

  deleteProject(id: string): void {
    if (!this.authService.isLoggedIn()) {
      this.toasterService.error('You must be logged in to delete a project.');
      this.router.navigate(['/login']);
      return;
    }

    const email = localStorage.getItem('userEmail');

    if (!email) {
      this.toasterService.error('Email is missing');
      return;
    }

    this.projectService.deleteProject(id, email).subscribe(
      (response: ApiResponse) => {
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
