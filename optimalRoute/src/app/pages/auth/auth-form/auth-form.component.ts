import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isRequiredError } from '../../admin/admin-db/forms/validators';

@Component({
    selector: 'app-auth-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './auth-form.component.html',
    styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
    @Input() btnText = '';
    @Input() authFormGroup!: FormGroup<{
        login: FormControl<string>;
        password: FormControl<string>;
    }>;
    @Output() hasButtonPressed = new EventEmitter<boolean>;

    constructor() {}

    click() {
        this.hasButtonPressed.emit(true);
    }

    isRequiredAuthError(form: FormGroup) {
        return isRequiredError(form);
    }
}
