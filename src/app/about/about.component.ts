import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
    userName: string = '';

    ngOnInit(): void {
        const email = localStorage.getItem('userEmail');
    }
}
