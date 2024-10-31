// project.model.ts
export interface Project {
    id: string;
    title: string;
    description: string;
    link: string;
    project_status: string;  // Optional fields
    tags: string[];  // Optional fields
    updated_on: string;
    email: string;
    resumeFile: File | null;
  }
  
  export interface ApiResponse {
    success: boolean;
    data?: Project[];
    message?: string;
  }
  