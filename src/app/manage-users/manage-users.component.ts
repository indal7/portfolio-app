// src/app/components/manage-users/manage-users.component.ts
import { Component, OnInit } from '@angular/core';
import { ToasterService } from '../toaster.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];

  constructor(
    private userService: UserService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // Fetch users from the backend
  getUsers(): void {
    this.userService.getUsers().subscribe(
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

  // Update user role
  updateUserRole(userEmail: string, newRole: string): void {
    this.userService.updateUserRole(userEmail, newRole).subscribe(
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
