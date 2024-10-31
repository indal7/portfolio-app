import { Component, OnInit } from '@angular/core';
import { ToasterService } from '../toaster.service'; // Import the service

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {
  messages: { type: string, text: string }[] = [];

  constructor(private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.toasterService.getMessages().subscribe(message => {
      this.messages.push(message);
      setTimeout(() => this.removeMessage(message), 3000); // Auto-remove after 3 seconds
    });
  }

  removeMessage(message: { type: string, text: string }): void {
    this.messages = this.messages.filter(m => m !== message);
  }
}
