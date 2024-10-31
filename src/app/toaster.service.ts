import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private messagesSubject = new Subject<{ type: string, text: string }>();

  getMessages() {
    return this.messagesSubject.asObservable();
  }

  success(message: string) {
    this.messagesSubject.next({ type: 'success', text: message });
  }

  error(message: string) {
    this.messagesSubject.next({ type: 'error', text: message });
  }
}
