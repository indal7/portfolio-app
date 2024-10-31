import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from '../toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.http.get<any>(`${this.apiUrl}/fetch_all_users`).subscribe(
      response => {
        if (response.success) {
          // Initialize users with roleChanged and originalRole properties
          this.users = response.message.users.map(user => ({
            ...user,
            originalRole: user.role, // Store original role
            roleChanged: false // Set default to false
          })) || [];
          this.toasterService.success('Users loaded successfully!');
        } else {
          this.toasterService.error(response.message || 'Error fetching users.');
        }
      },
      error => {
        console.error('Error fetching users:', error);
        this.toasterService.error('Failed to load users. Please try again.');
      }
    );
  }

  updateUserRole(userEmail: string, newRole: string): void {
    this.http.put<any>(`${this.apiUrl}/update_user_role`, { role: newRole, email: userEmail }).subscribe(
      response => {
        if (response.success) {
          this.toasterService.success('User role updated successfully!');
          this.getUsers(); // Refresh the user list to reflect changes
        } else {
          this.toasterService.error(response.message || 'Error updating user role.');
        }
      },
      error => {
        console.error('Error updating user role:', error);
        this.toasterService.error('Failed to update user role. Please try again.');
      }
    );
  }

  // Method to handle the role change
  onRoleChange(user: any): void {
    user.roleChanged = user.role !== user.originalRole; // Set flag based on comparison
  }
}
