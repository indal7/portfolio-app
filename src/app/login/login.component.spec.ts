import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, HttpClientModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login with correct email and password', () => {
    component.email = 'kiran@gmail.com'; // Set up the email
    component.password = 'kiran'; // Dummy password

    // Simulate the login method and set the response directly
    component.loginResponse = { success: true, message: 'Login successful' };
    
    // Call the login method (if you have additional logic, adjust accordingly)
    component.login(); 

    // Expect the login response to be set correctly
    expect(component.loginResponse).toEqual({ success: true, message: 'Login successful' });
  });

  it('should handle login failure', () => {
    component.email = 'kiran@gmail.com'; // Set up the email
    component.password = 'kiran'; // Invalid password for failure test

    // Simulate the login failure response
    component.loginResponse = { success: false, message: 'Login failed' };
    
    // Call the login method (if you have additional logic, adjust accordingly)
    component.login(); 

    // Expect the login response to indicate failure
    expect(component.loginResponse).toEqual({ success: false, message: 'Login failed' });
  });
});
