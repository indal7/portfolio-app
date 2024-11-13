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

  // Add the missing fields
  technologies: string;  // For Technologies Used
  dateCompleted: string;  // For Date Completed
}
  
export interface ApiResponse {
  success: boolean;
  data?: Project; // Allowing for both single and array responses
  message?: string;
}
