import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isRequiredError, stringRangeValidator } from '../../admin/admin-db/forms/validators';

@Component({
    selector: 'app-auth-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './auth-form.component.html',
    styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
    @Input() btnText = '';

    private fb = inject(FormBuilder);

    authFormGroup = this.fb.group({
        login: ['', [Validators.required, stringRangeValidator(12, 4)]],
        password: ['', [Validators.required, stringRangeValidator(12, 4)]],
    });

    constructor(private router: Router) {}

    click() {
        this.router.navigateByUrl('admin-page');
    }

    isRequiredAuthError(form: FormGroup) {
        return isRequiredError(form);
    }

}
