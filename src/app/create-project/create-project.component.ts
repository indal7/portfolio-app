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
    
  private predefinedProjects = [
    {
      title: 'AI Chatbot',
      description: 'A chatbot powered by AI to help with customer support.',
      link: 'https://ai-chatbot.com',
      project_status: 'Completed',
      technologies: 'Node.js, NLP, TensorFlow',
      dateCompleted: '2024-01-15'
    },
    {
      title: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform with payment gateway integration.',
      link: 'https://ecommerce.com',
      project_status: 'In Progress',
      technologies: 'React, Node.js, MongoDB',
      dateCompleted: '2024-06-30'
    },
    {
      title: 'Data Analytics Dashboard',
      description: 'A dashboard to visualize data insights with charts and graphs.',
      link: 'https://data-dashboard.com',
      project_status: 'Completed',
      technologies: 'Python, Pandas, Flask',
      dateCompleted: '2024-03-22'
    },
    {
      title: 'Social Media App',
      description: 'A social media app for sharing photos and status updates.',
      link: 'https://socialmediaapp.com',
      project_status: 'In Progress',
      technologies: 'Angular, Firebase, Node.js',
      dateCompleted: '2024-07-10'
    },
    {
      title: 'Weather Forecast App',
      description: 'An app that provides weather forecasts based on location.',
      link: 'https://weatherapp.com',
      project_status: 'Completed',
      technologies: 'JavaScript, OpenWeather API',
      dateCompleted: '2024-02-05'
    },
    {
      title: 'Task Management Tool',
      description: 'A tool for managing and tracking tasks with deadlines and priorities.',
      link: 'https://taskmanager.com',
      project_status: 'Completed',
      technologies: 'Vue.js, Laravel, MySQL',
      dateCompleted: '2023-12-01'
    },
    {
      title: 'Virtual Reality Game',
      description: 'A VR game with immersive 3D environments and multiplayer features.',
      link: 'https://vrgame.com',
      project_status: 'In Progress',
      technologies: 'Unity, C#, VR SDK',
      dateCompleted: '2024-08-15'
    },
    {
      title: 'Online Learning Platform',
      description: 'A platform for online courses, quizzes, and student tracking.',
      link: 'https://learnonline.com',
      project_status: 'Completed',
      technologies: 'Django, PostgreSQL, React',
      dateCompleted: '2024-05-20'
    },
    {
      title: 'Blockchain-based Voting System',
      description: 'A secure voting system using blockchain technology to ensure transparency.',
      link: 'https://blockchainvoting.com',
      project_status: 'In Progress',
      technologies: 'Ethereum, Solidity, Node.js',
      dateCompleted: '2024-09-10'
    },
    {
      title: 'Expense Tracker App',
      description: 'An app for tracking personal finances and monthly expenses.',
      link: 'https://expensetracker.com',
      project_status: 'Completed',
      technologies: 'React Native, Firebase',
      dateCompleted: '2024-04-25'
    }
  ];

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

  createRandomProject(): void {
    const randomIndex = Math.floor(Math.random() * this.predefinedProjects.length);
    const randomProject = this.predefinedProjects[randomIndex];
  
    // Assign the randomly selected project to newProject, including missing properties
    this.newProject = {
      ...randomProject,
      id: Date.now().toString(),         // Generate a new unique ID
      updated_on: new Date().toISOString(),
      email: localStorage.getItem('userEmail') || '',
      tags: [],                         // Ensure tags is an empty array or set to a default value
      resumeFile: null                   // Set resumeFile to null or provide a default value
    };
    // this.addProject()
    // Optionally, you can show the selected random project in the form
    console.log('Random project created:', this.newProject);
  }
  
  
}
