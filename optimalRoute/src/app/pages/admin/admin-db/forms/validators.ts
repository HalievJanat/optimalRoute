import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function floatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (value !== 0 && !value) {
            return null;
        }

        const isValid = /^[0-9]+(\.[0-9]+)?$/.test(value);

        return isValid ? null : { floatOnly: true };
    };
}

export function stringRangeValidator(maxValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value as string;

        if (value !== '' && !value) {
            return null;
        }

        if (value.length > maxValue) {
            return { stringRange: true };
        }

        return null;
    };
}

export function rangeValidator(minValue: number, maxValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (value !== 0 && !value) {
            return null;
        }

        if (value < minValue || value > maxValue) {
            return { range: true };
        }

        return null;
    };
}

export function allowOnlyDigits(event: KeyboardEvent): void {
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
}

export function isEditFormControls(editForm: FormArray<FormGroup>) {
    if (editForm.controls[0]) {
        return true;
    }

    return false;
}

export function isRequiredError(form: FormGroup) {
    let hasErrors = false;

    Object.keys(form.controls).forEach(key => {
        const control = form.get(key);

        if (control?.dirty && control.hasError('required')) {
            hasErrors = true;
            return;
        }
    });

    return hasErrors;
}
