import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ToasterComponent } from './toaster/toaster.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { EditProjectComponent } from './edit-project/edit-project.component';

import { AuthInterceptor } from './auth-interceptor.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './profile/profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ToasterComponent,
    CreateProjectComponent,
    ProjectsListComponent,
    EditProjectComponent,
    ResetPasswordComponent,
    HeaderComponent,
    FooterComponent,
    ManageProjectsComponent,
    ManageUsersComponent,
    AboutComponent,
    ContactComponent,
    ProfileComponent,
    HeaderComponent,
    ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
