import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';
import { ToasterService } from '../toaster.service';

export interface TokenPayload {
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
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
  contact_info: { type: string; value: string };
  skills: string;
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
    contact_info: {
      type: '',
      value: ''
    },
    skills: '',
    projectTags: [],
    resume: null,
  };

  editMode = false;
  isLoading = true;
  errorFetchingData = false;
  newTag = '';

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private authService: AuthService, private toasterService: ToasterService) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded: TokenPayload = jwtDecode(token);
      this.userProfile.email = decoded.email;
      this.getUserProfile(this.userProfile.email);
    }
  }

  getUserProfile(email: string): void {
    this.authService.getUserProfile(email).subscribe(
      (response: ApiResponse<UserProfile>) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.userProfile = response.data;
          this.userProfile.contact_info = {
            type: this.userProfile.contact_info.type,
            value: this.userProfile.contact_info.value,
          };

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

    this.authService.updateUserProfile(formData).subscribe(
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
        if (value) {
          if (key === 'contact_info') {
            // Append type and value separately for contact_info
            formData.append('contact_info[type]', this.userProfile.contact_info.type);
            formData.append('contact_info[value]', this.userProfile.contact_info.value);
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

  updatecontact_info(index: number, type: string, value: string) {
    this.userProfile.contact_info[index] = { type, value };
  }

createProfile() { 
    this.updateProfile();
  }

}
