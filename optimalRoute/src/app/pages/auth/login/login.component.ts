import { Component, EventEmitter, inject, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { HeaderComponent } from '../../../header/header.component';
import { AuthUser, authUser } from '../auth-user-constant';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { stringRangeValidator } from '../../admin/admin-db/forms/validators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [HeaderComponent, AuthFormComponent, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);

    loginFormGroup = this.fb.nonNullable.group({
        login: ['', [Validators.required, stringRangeValidator(12, 4)]],
        password: ['', [Validators.required, stringRangeValidator(12, 4)]],
    });

    hasLoginButtonPressed(signal: boolean) {
        this.loginFormGroup.disable();

        const login = this.loginFormGroup.controls.login.value;
        const password = this.loginFormGroup.controls.password.value;

        if (login === 'admin' && password === 'admin') {
            authUser.login = 'admin';
            authUser.password = 'admin';
            authUser.adminRole = true;
            this.router.navigateByUrl('admin-page');
            return;
        }

        //TODO посылаем POST, чтобы проверить, ест ли такое user иначе ошибка в toastr
        authUser.login = login;
        authUser.password = password;
        authUser.adminRole = false;

        this.loginFormGroup.reset();
        this.loginFormGroup.enable();
    }
}
