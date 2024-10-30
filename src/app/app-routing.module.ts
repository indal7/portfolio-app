import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
// import { ProjectsComponent } from './projects/projects.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { EditProjectComponent } from './edit-project/edit-project.component';  // Import the AppRoutingModule
import { ResetPasswordComponent } from './reset-password/reset-password.component'; // Adjust the path as needed


// const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   // { path: 'projects', component: ProjectsComponent }, // Example route for projects
//   { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route
//   { path: '**', redirectTo: '/login' }  // Wildcard route for handling unknown routes
// ];

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login on default
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create-project', component: CreateProjectComponent },
  { path: 'edit-project/:id', component: EditProjectComponent }, // Assuming you are editing specific projects by ID
  { path: 'projects-list', component: ProjectsListComponent },
  { path: '**', redirectTo: '/login' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
