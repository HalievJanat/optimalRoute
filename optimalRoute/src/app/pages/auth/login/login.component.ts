import { Component } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { HeaderComponent } from '../../../header/header.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [HeaderComponent, AuthFormComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {}
