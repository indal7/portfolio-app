import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isLoggedIn: boolean = true; // Set default value or logic to determine login state

  // Add any necessary logic to update isLoggedIn based on your authentication flow
}
