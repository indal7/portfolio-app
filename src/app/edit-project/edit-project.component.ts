import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { ToasterService } from '../toaster.service';
import { Project } from '../project.model';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  project: Project = {
    id: '',
    title: '',
    description: '',
    link: '',
    project_status: '', // Ensure all necessary fields are present
    tags: [],
    updated_on: '',
    email: '',
    resumeFile: null,
    technologies: '', // Added technologies
    dateCompleted: '' // Added dateCompleted
  };

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectService.getProjectById(projectId).subscribe(
        response => {
          if (response.success) {
            // Ensure response.data contains all required fields
            this.project = response.data;
          } else {
            this.toasterService.error('Error fetching project');
          }
        },
        error => this.toasterService.error('Error fetching project')
      );
    }
  }

  saveProject(): void {
    this.projectService.updateProject(this.project).subscribe(
      () => {
        this.toasterService.success('Project updated successfully!');
        this.router.navigate(['/projects-list']);
      },
      error => this.toasterService.error('Error updating project')
    );
  }
}
