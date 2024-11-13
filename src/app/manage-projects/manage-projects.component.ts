// src/app/manage-projects/manage-projects.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { ToasterService } from '../toaster.service';
import { Project } from '../project.model';

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.css']
})
export class ManageProjectsComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.projectService.getAllProjects(email).subscribe(
        response => {
          if (response.success) {
            this.projects = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
            this.toasterService.success('Projects loaded successfully!');
          } else {
            this.toasterService.error('Error loading projects');
          }
        },
        error => this.toasterService.error('Failed to load projects')
      );
    }
  }

  updateProject(project: Project): void {
    this.router.navigate(['edit-project', project.id]);
  }

  deleteProject(id: string): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.projectService.deleteProject(id, email).subscribe(
        response => {
          if (response.success) {
            this.toasterService.success('Project deleted successfully!');
            this.loadProjects();
          } else {
            this.toasterService.error('Error deleting project');
          }
        },
        error => this.toasterService.error('Failed to delete project')
      );
    }
  }

  addMoreProject(): void {
    this.router.navigate(['/create-project']);
  }
}
