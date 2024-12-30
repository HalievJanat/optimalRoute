import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    router = inject(Router);

    logout() {
        sessionStorage.clear();

        console.log(sessionStorage.getItem('user'));

        this.router.navigateByUrl('login');
    }
}
