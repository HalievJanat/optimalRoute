import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { allowOnlyDigits, floatValidator, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TypeFine } from '../../../../../models/fine-type.model';

@Component({
    selector: 'app-fine-form',
    standalone: true,
    imports: [NgbDropdownModule, ReactiveFormsModule, NgbPaginationModule],
    templateUrl: './fine-form.component.html',
    styleUrl: '../forms.scss',
})
export class FineFormComponent implements OnInit, AfterViewInit {
    @Input() activeRightElement = 1;
    @Output() activeRightElementChange = new EventEmitter<number>();

    private fb = inject(FormBuilder);

    httpService = inject(HttpService);

    isFineTypeEdit = false;

    editFineTypeNumber = 0;

    pageFineTypeShowing: TypeFine[] = [];

    fineTypesArrSize = 0;

    fineTypeTabPage = 1;

    fineTypes: TypeFine[] = [];

    fineTypeAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(40)]],
        price: [null as number | null, [Validators.required, rangeValidator(300, 20000)]],
    });

    fineTypeEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
            price: FormControl<number | null>;
        }>
    >([]);

    constructor() {
        this.httpService.getTypeFines().subscribe(fineTypes => {
            this.fineTypes = fineTypes;
            this.fineTypesArrSize = this.fineTypes.length;
            this.fineTypes.forEach(fineType => {
                const addedfineTypeGroup = this.fb.nonNullable.group({
                    name: [fineType.name, [Validators.required, stringRangeValidator(40)]],
                    price: [fineType.price as number | null, [Validators.required, rangeValidator(300, 20000)]],
                });
                addedfineTypeGroup.disable();

                this.fineTypeEditForm.push(addedfineTypeGroup);
            });
        });
    }

    //При инициализации компонент отображает именно форму добавления
    ngOnInit(): void {
        this.activeRightElement = 1;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.activeRightElementChange.emit(this.activeRightElement); //чтобы в правой панели визуально текущая кнопка менялась
        }, 150);
    }

    addFineType() {
        const control = this.fineTypeAddForm.controls;

        const addedFineType = {
            name: control.name.value,
            price: control.price.value as number,
        };

        this.fineTypes.push(addedFineType);

        this.httpService.addMapDbValue<TypeFine>(addedFineType, 'fine');

        const addedFineTypeGroup = this.fb.nonNullable.group({
            name: [control.name.value, [Validators.required, stringRangeValidator(40)]],
            price: [control.price.value, [Validators.required, rangeValidator(300, 20000)]],
        });
        addedFineTypeGroup.disable();

        this.fineTypeEditForm.push(addedFineTypeGroup);

        this.fineTypeAddForm.reset();

        this.fineTypesArrSize++;
    }

    //TODO
    editFineTypes() {
        const control = this.fineTypeEditForm.controls[this.editFineTypeNumber].controls;

        this.fineTypes[this.editFineTypeNumber] = {
            name: control.name.value,
            price: control.price.value as number,
        };

        this.isFineTypeEdit = false;
        this.fineTypeEditForm.controls[this.editFineTypeNumber].disable();
    }

    cancelEditFineTypes() {
        this.fineTypeEditForm.controls[this.editFineTypeNumber].setValue({
            name: this.fineTypes[this.editFineTypeNumber].name,
            price: this.fineTypes[this.editFineTypeNumber].price,
        });

        this.isFineTypeEdit = false;
        this.fineTypeEditForm.controls[this.editFineTypeNumber].disable();
    }

    //TODO
    fineTypeDelete(index: number) {
        this.fineTypes.splice(index, 1);
        this.fineTypeEditForm.controls.splice(index, 1);
        this.fineTypesArrSize--;
    }

    fineTypeDuplicateValidation(
        formGroup: FormGroup<{
            name: FormControl<string>;
            price: FormControl<number | null>;
        }>,
        editIndex?: number
    ) {
        let hasDuplicate = false;

        this.fineTypes.forEach((fineType, index) => {
            if (editIndex === undefined || editIndex !== index) {
                if (formGroup.controls.name.value === fineType.name) {
                    hasDuplicate = true;
                    return;
                }
            }
        });

        return hasDuplicate;
    }

    //Шаблон не видит импортируемые функции
    isRequiredFineError(form: FormGroup) {
        return isRequiredError(form);
    }

	allowOnlyDigitsFine(event: KeyboardEvent): void {
        allowOnlyDigits(event);
    }
}
