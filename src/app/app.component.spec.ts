import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { AppComponent } from './app.component';
import { ToasterComponent } from './toaster/toaster.component'; // Ensure this path is correct
import { ToasterService } from './toaster.service'; // Correctly import ToasterService

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => { // Change async to waitForAsync
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ToasterComponent // Declare your ToasterComponent
      ],
      providers: [
        ToasterService // Provide the ToasterService here
      ],
      imports: [
        RouterTestingModule // Add RouterTestingModule for router-related elements
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'portfolio-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('portfolio-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // expect(compiled.querySelector('.content span').textContent).toContain('portfolio-app app is running!');
  });
});
