import { Component, EventEmitter, inject, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { HeaderComponent } from '../../../header/header.component';
import { AuthUser } from '../auth-user-constant';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { stringRangeValidator } from '../../admin/admin-db/forms/validators';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http-service.service';
import { ToastrService } from 'ngx-toastr';

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
    private httpService = inject(HttpService);
    private toastr = inject(ToastrService);

    loginFormGroup = this.fb.nonNullable.group({
        login: ['', [Validators.required, stringRangeValidator(12, 4)]],
        password: ['', [Validators.required, stringRangeValidator(12, 4)]],
    });

    hasLoginButtonPressed(signal: boolean) {
        this.loginFormGroup.disable();

        const login = this.loginFormGroup.controls.login.value;
        const password = this.loginFormGroup.controls.password.value;

        if (login === 'admin' && password === 'admin') {
            const authUser: AuthUser = {
                login: 'admin',
                password: 'admin',
                adminRole: true,
            };
            sessionStorage.setItem('user', JSON.stringify(authUser));
            this.router.navigateByUrl('admin-page');
            return;
        }

        const user: AuthUser = {
            login: login,
            password: password,
            adminRole: false,
        };

        this.httpService.authorizeUser(user).subscribe({
            next: areUserFind => {
                if (areUserFind) {
                    const authUser: AuthUser = {
                        login: login,
                        password: password,
                        adminRole: false,
                    };
                    sessionStorage.setItem('user', JSON.stringify(authUser));

                    this.router.navigateByUrl('user-page');
                    return;
                }

                this.loginFormGroup.reset();
                this.loginFormGroup.enable();
                this.toastr.error('Ошибка в логине или пароле', 'Ошибка');
            },
            error: () => {
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
            },
        });
    }
}
