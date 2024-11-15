import { Component } from '@angular/core';
import { faUser, faProjectDiagram, faUserCircle, faEnvelope, faUsersCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'portfolio-appg';
  faUser = faUser;
  faProjectDiagram = faProjectDiagram;
  faUserCircle = faUserCircle;
  faEnvelope = faEnvelope;
  faUsersCog = faUsersCog;
  faSignOutAlt = faSignOutAlt;
}
