import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { isRequiredError, stringRangeValidator } from '../../../pages/admin/admin-db/forms/validators';

@Component({
    selector: 'app-modal-input',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './modal-input.component.html',
    styleUrl: './modal-input.component.scss',
})
export class ModalInputComponent {
    activeModal = inject(NgbActiveModal);
    existingNames: string[] = [];

	private fb: FormBuilder = inject(FormBuilder);

    nameForm = this.fb.nonNullable.group({
		name: ['', [Validators.required, stringRangeValidator(30)]]
	});

    mapList: string[] = [];

    mapNameDuplicateValidation() {
        let hasDuplicate = false;

        this.existingNames.forEach((existingName) => {
            if (this.nameForm.controls.name.value === existingName) {
                hasDuplicate = true;
                return;
            }
        });

        return hasDuplicate;
    }

	isRequiredMapNameError() {
		return isRequiredError(this.nameForm);
	}
	
}
