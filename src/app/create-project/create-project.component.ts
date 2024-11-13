// src/app/create-project/create-project.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { ToasterService } from '../toaster.service';
import { Project } from '../project.model';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent {
  newProject: Project = {
    id: '',
    title: '',
    description: '',
    link: '',
    project_status: '', // corrected from projectStatus
    tags: [], // changed from technologies (if needed, you can keep technologies as a separate field)
    updated_on: '',
    email: '',
    resumeFile: null,
    technologies: '',
    dateCompleted: ''
  };
    
  @Output() projectCreated = new EventEmitter<void>();

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private toasterService: ToasterService
  ) {}

  addProject(): void {
    if (!this.isProjectDataValid()) {
      this.toasterService.error('All fields are required.');
      return;
    }

    const projectData = { ...this.newProject, id: Date.now().toString(), updated_on: new Date().toISOString(), email: localStorage.getItem('userEmail') || '' };

    this.projectService.createProject(projectData).subscribe(
      response => {
        if (response.success) {
          this.toasterService.success('Project added successfully!');
          this.projectCreated.emit();
          this.router.navigate(['/projects-list']);
        } else {
          this.toasterService.error('Error adding project');
        }
      },
      error => this.toasterService.error('Error adding project')
    );
  }

  private isProjectDataValid(): boolean {
    const { title, description, link, project_status, technologies, dateCompleted } = this.newProject;
    return !!(title && description && link && project_status && technologies && dateCompleted);
  }
  
}
