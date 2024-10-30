import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';
import { environment } from 'src/environments/environment';


interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  technologies: string;
  dateCompleted: string;
  projectStatus: string;
  email: string;
  resumeFile: File | null;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

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
    technologies: '',
    dateCompleted: '',
    projectStatus: '',
    email: '',
    resumeFile: null
  };
  apiUrl = environment.apiUrl;

  @Output() projectCreated = new EventEmitter<void>();

  constructor(private http: HttpClient, private router: Router, private toasterService: ToasterService) {}

  addProject(): void {
    if (!this.newProject.title || !this.newProject.description || !this.newProject.link || !this.newProject.technologies || !this.newProject.dateCompleted || !this.newProject.projectStatus) {
      console.error('Missing required fields.');
      return;
    }
  
    const payload = {
      id: Date.now().toString(),
      title: this.newProject.title,
      description: this.newProject.description,
      link: this.newProject.link,
      technologies: this.newProject.technologies,
      dateCompleted: this.newProject.dateCompleted,
      projectStatus: this.newProject.projectStatus,
      updated_on: new Date().toISOString(),
      email: localStorage.getItem('userEmail') || '',
    };
  
    this.http.post<ApiResponse>(`${this.apiUrl}/projects`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe(
      response => {
        if (response.success) {
          this.toasterService.success(`Project added successfully: ${response.message}`);
          console.log('Project added successfully', response);
          this.router.navigate(['/projects-list']);
          this.projectCreated.emit();
          this.resetForm();
        } else {
          console.error('Error adding project:', response.message);
        }
      },
      error => {
        console.error('Error adding project:', error);
        this.toasterService.error(`Error adding project: ${error}`);
      }
    );
  }

  private resetForm(): void {
    this.newProject = { id: '', title: '', description: '', link: '', technologies: '', dateCompleted: '', projectStatus: '', email: '', resumeFile: null };
  }
}
