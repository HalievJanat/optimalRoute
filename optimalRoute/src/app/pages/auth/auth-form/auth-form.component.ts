import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isRequiredError } from '../../admin/admin-db/forms/validators';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-auth-form',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './auth-form.component.html',
    styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
    isPasswordVisible = false;
    @Input() btnText = '';
    @Input() authFormGroup!: FormGroup<{
        login: FormControl<string>;
        password: FormControl<string>;
    }>;
    @Output() hasButtonPressed = new EventEmitter<boolean>;

    constructor() {}

    changePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    click() {
        this.hasButtonPressed.emit(true);
    }

    isRequiredAuthError(form: FormGroup) {
        return isRequiredError(form);
    }
}
