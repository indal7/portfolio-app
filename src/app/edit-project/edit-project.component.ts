import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project, ApiResponse } from '../project.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent {
  // project: Project = { id: '', title: '', description: '' ,link:'', updated_on:'', email:'', resumeFile:null , project_status:''}
  // @Input() apiUrl: string;
  // @Output() projectUpdated = new EventEmitter<void>();

  project: Project = { 
    id: '', 
    title: '', 
    description: '', 
    link: '', 
    updated_on: '', 
    email: '', 
    resumeFile: null, 
    project_status: '',
    tags:[] // Ensure this matches your Project interface
  };
  apiUrl = 'http://54.251.133.142:5001/projects'; 
  constructor(private http: HttpClient, private route: ActivatedRoute, private router : Router,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.fetchProject(projectId);
    }
  }

  fetchProject(id: string): void {
    this.http.get<any>(`${this.apiUrl}/${id}`).subscribe(
      data => {
        if (data.success) {
          this.project = data.data; // Ensure this matches your response structure
        } else {
          console.error('Error fetching project:', data.message);
        }
      },
      error => console.error('Error fetching project:', error)
    );
  }

  saveProject(): void {
    this.http.put(`${this.apiUrl}/${this.project.id}`, this.project).subscribe(
      () => {
        this.toasterService.success('Project updated successfully!');
        this.router.navigate(['/projects-list']);
      },
      error => {
        console.error('Error updating project:', error);
        this.toasterService.error('Error updating project. Please try again.');
      }
    );
  }
}
