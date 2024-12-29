import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { stringRangeValidator } from '../../admin/admin-db/forms/validators';
import { ToastrService } from 'ngx-toastr';
import { AuthUser } from '../auth-user-constant';
import { HttpService } from '../../../services/http-service.service';

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [HeaderComponent, AuthFormComponent],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private toastr = inject(ToastrService);
    private httpService = inject(HttpService);

    registrationFormGroup = this.fb.nonNullable.group({
        login: ['', [Validators.required, stringRangeValidator(12, 4)]],
        password: ['', [Validators.required, stringRangeValidator(12, 4)]],
    });

    hasRegistrationButtonPressed(signal: boolean) {
        this.registrationFormGroup.disable();

        const login = this.registrationFormGroup.controls.login.value;
        const password = this.registrationFormGroup.controls.password.value;

        if (login === 'admin') {
            this.toastr.error('Пользователь с таким логином уже есть', 'Ошибка');
            this.registrationFormGroup.reset();
            this.registrationFormGroup.enable();
            return;
        }

        const newUser: AuthUser = {
            login: login,
            password: password,
            adminRole: false,
        };

        this.httpService.addNewUser(newUser).subscribe({
            next: isAdding => {
                if (isAdding) {
                    const authUser: AuthUser = {
                        login: login,
                        password: password,
                        adminRole: false,
                    };
                    sessionStorage.setItem('user', JSON.stringify(authUser));
                    
                    this.router.navigateByUrl('user-page');
                    return
                }

                this.registrationFormGroup.reset();
                this.registrationFormGroup.enable();
                this.toastr.error('Пользователь с таким логином уже существует', 'Ошибка')

            },
            error: () => {
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
            },
        });
    }
}
