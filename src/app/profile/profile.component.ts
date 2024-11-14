import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ToasterService } from '../toaster.service';
import { UserService } from '../services/user.service';

export interface TokenPayload {
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface Skill {
  skill_name: string;
  skill_level: string;
  skill_type: string;
  description: string;
  created_on: string;
}

export interface contact_info {
  type: string;
  value: string;
}

export interface UserProfile {
  username: string;
  email: string;
  bio: string;
  profile_photo: string | File | null;
  contact_info: { };
  skills: Skill[];
  projectTags: string[];
  resume: string | File | null;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile = {
    username: '',
    email: '',
    bio: '',
    profile_photo: null,
    contact_info: { },
    skills: [],
    projectTags: [],
    resume: null,
  };

  selectedContactType: string = 'email';
  contactInfoValue: string = '';

  editMode = false;
  isLoading = true;
  errorFetchingData = false;
  newTag = '';
  newSkillName: string = ''; 
  selectedSkillLevel: string = 'Beginner'; // Default skill level
  skillLevels: string[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private userService: UserService, // Inject UserService
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded: TokenPayload = jwtDecode(token);
      this.userProfile.email = decoded.email;
      this.getUserProfile(this.userProfile.email);
    }
  }

  // Call the UserService to fetch user profile
  getUserProfile(email: string): void {
    this.userService.getUserProfile(email).subscribe(
      (response: ApiResponse<UserProfile>) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.userProfile = response.data;
          this.updateContactInfoKey();
          this.updateContactInfoValue();
          this.errorFetchingData = false;
        } else {
          this.handleProfileFetchError(response.message);
        }
      },
      (error) => {
        this.isLoading = false;
        this.handleProfileFetchError(error.message);
      }
    );
  }

  handleProfileFetchError(message?: string) {
    this.errorFetchingData = true;
    const errorMessage = message || 'Failed to fetch user profile.';
    this.toasterService.error(errorMessage);
  }

  async updateProfile() {
    const formData = await this.buildFormData();

    this.userService.updateUserProfile(formData).subscribe(
      (response: ApiResponse<any>) => {
        if (response.success) {
          this.toasterService.success('Profile updated successfully!');
          this.editMode = false;
          this.getUserProfile(this.userProfile.email);
        } else {
          this.toasterService.error('Failed to update profile. ' + response.message);
        }
      },
      (error) => {
        this.toasterService.error('Failed to update profile. ' + error.message);
      }
    );
  }

  // Build FormData with profile photo, resume, and other fields
  async buildFormData(): Promise<FormData> {
    const formData = new FormData();

    // Append the resume or the existing resume as a file
    if (this.userProfile.resume instanceof File) {
      formData.append('resume', this.userProfile.resume);
    } else if (typeof this.userProfile.resume === 'string' && this.userProfile.resume) {
      const resumeFile = await this.downloadFile(this.userProfile.resume);
      formData.append('resume', resumeFile);
    }

    // Append the profile picture or the existing profile picture as a file
    if (this.userProfile.profile_photo instanceof File) {
      formData.append('profilePicture', this.userProfile.profile_photo);
    } else if (typeof this.userProfile.profile_photo === 'string' && this.userProfile.profile_photo) {
      const profilePhotoFile = await this.downloadFile(this.userProfile.profile_photo);
      formData.append('profilePicture', profilePhotoFile);
    }

    // Append other fields
    for (const key in this.userProfile) {
      
      if (key !== 'resume' && key !== 'profile_photo') {
        const value = (this.userProfile as any)[key];
        console.log("key", key, value)
        if (value) {
          if (key === 'contact_info') {
            // Convert contact_info object to JSON string
            formData.append('contact_info', JSON.stringify(this.userProfile.contact_info));
          } else {
            // For other fields, append as normal
            formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
          }
        }
      }
    }
    return formData;
  }

  async downloadFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.substring(url.lastIndexOf('/') + 1); // Extract filename from URL
    return new File([blob], fileName, { type: blob.type });
  }

  // Handle profile photo change (upload new photo)
  onProfilePhotoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file = target.files[0];
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        this.userProfile.profile_photo = file; // Set new profile photo
      } else {
        this.toasterService.error('Only image files under 5MB are allowed.');
      }
    }
  }

  // Handle resume change (upload new resume)
  onResumeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file = target.files[0];
      if (['application/pdf', 'application/msword'].includes(file.type) && file.size <= 10 * 1024 * 1024) {
        this.userProfile.resume = file; // Set new resume
      } else {
        this.toasterService.error('Only PDF or Word files under 10MB are allowed.');
      }
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  addTag(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.newTag.trim()) {
      if (!this.userProfile.projectTags.includes(this.newTag.trim())) {
        this.userProfile.projectTags.push(this.newTag.trim());
      }
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.userProfile.projectTags.splice(index, 1);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  extractFileName(file: string | File): string {
    if (typeof file === 'string') {
      return file.split('/').pop() || 'Resume';
    } else if (file instanceof File) {
      return file.name || 'Resume';
    }
    return 'Resume';
  }

  // Update contact info
  updatecontact_info(index: number, type: string, value: string) {
    this.userProfile.contact_info[index] = { type, value };
  }

  // Add skill to the profile
  addSkill() {
    if (this.newSkillName.trim() !== '') {
      const newSkill: Skill = {
        skill_name: this.newSkillName,
        skill_level: 'Beginner',
        skill_type: 'Technical',
        description: '',
        created_on: new Date().toISOString()
      };
      this.userProfile.skills.push(newSkill);
      this.newSkillName = '';
    }
  }

  // Remove skill from the user's profile
  removeSkill(index: number) {
    this.userProfile.skills.splice(index, 1);  // Remove the skill at the given index
  }
  
  createProfile() {
    this.updateProfile();
  }

  updateContactInfoKey() {
    // Reset contact_info with the selected key
    this.userProfile.contact_info = { [this.selectedContactType]: this.contactInfoValue };
  }

  updateContactInfoValue() {
    // Update the contact value for the selected type
    this.userProfile.contact_info[this.selectedContactType] = this.contactInfoValue;
  }

  getContactInfoType(): string {
    // Get the contact type key (e.g., 'email' or 'phone') from contact_info
    return Object.keys(this.userProfile.contact_info)[0] as string || '';
  }
  
  getContactInfoValue(): string {
    // Get the contact value from contact_info
    return Object.values(this.userProfile.contact_info)[0] as string || '';
  }  
}