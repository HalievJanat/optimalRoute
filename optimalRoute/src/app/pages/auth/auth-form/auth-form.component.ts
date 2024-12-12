import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth-form',
    standalone: true,
    imports: [],
    templateUrl: './auth-form.component.html',
    styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
    @Input() btnText = '';

    constructor(private router: Router) {}

    click() {
        this.router.navigateByUrl('admin-page');
    }
}
