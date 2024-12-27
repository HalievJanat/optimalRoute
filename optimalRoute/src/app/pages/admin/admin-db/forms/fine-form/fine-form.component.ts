import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { allowOnlyDigits, floatValidator, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TypeFine } from '../../../../../models/fine-type.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-fine-form',
    standalone: true,
    imports: [NgbDropdownModule, ReactiveFormsModule, NgbPaginationModule],
    templateUrl: './fine-form.component.html',
    styleUrl: '../forms.scss',
})
export class FineFormComponent implements OnInit, AfterViewInit {
    @Input() activeRightElement = 2;
    @Output() activeRightElementChange = new EventEmitter<number>();

    private fb = inject(FormBuilder);

    httpService = inject(HttpService);

    isgetErr = false;

    toastr = inject(ToastrService);

    isFineTypeEdit = false;

    editFineTypeNumber = 0;

    pageFineTypeShowing: TypeFine[] = [];

    fineTypesArrSize = 0;

    fineTypeTabPage = 1;

    fineTypes: TypeFine[] = [];

    fineTypeEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
            price: FormControl<number | null>;
        }>
    >([]);

    constructor() {
        this.httpService.getTypeFines().subscribe({
            next: fineTypes => {
                this.fineTypes = fineTypes;
                this.fineTypesArrSize = this.fineTypes.length;
                this.fineTypes.forEach(fineType => {
                    const addedfineTypeGroup = this.fb.nonNullable.group({
                        name: [fineType.name],
                        price: [fineType.price as number | null, [Validators.required, rangeValidator(300, 20000)]],
                    });
                    addedfineTypeGroup.disable();

                    this.fineTypeEditForm.push(addedfineTypeGroup);
                });
            },
            error: _ => {
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                this.isgetErr = true;
            },
        });
    }

    //При инициализации компонент отображает именно форму редактирования
    ngOnInit(): void {
        this.activeRightElement = 2;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.activeRightElementChange.emit(this.activeRightElement); //чтобы в правой панели визуально текущая кнопка менялась
        }, 150);
    }

    editFineTypes() {
        const control = this.fineTypeEditForm.controls[this.editFineTypeNumber].controls;

        const editFine = {
            name: control.name.value,
            price: control.price.value as number,
        };

        this.httpService.updateMapDbValue<TypeFine>(editFine, 'fine').subscribe({
            next: () => {
                this.fineTypes[this.editFineTypeNumber] = editFine;

                this.isFineTypeEdit = false;
                this.fineTypeEditForm.controls[this.editFineTypeNumber].disable();
            },
            error: () => {
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                this.cancelEditFineTypes();
                this.isFineTypeEdit = false;
                this.fineTypeEditForm.controls[this.editFineTypeNumber].disable();
            },
        });
    }

    cancelEditFineTypes() {
        this.fineTypeEditForm.controls[this.editFineTypeNumber].setValue({
            name: this.fineTypes[this.editFineTypeNumber].name,
            price: this.fineTypes[this.editFineTypeNumber].price,
        });

        this.isFineTypeEdit = false;
        this.fineTypeEditForm.controls[this.editFineTypeNumber].disable();
    }

    //Шаблон не видит импортируемые функции
    isRequiredFineError(form: FormGroup) {
        return isRequiredError(form);
    }

    allowOnlyDigitsFine(event: KeyboardEvent): void {
        allowOnlyDigits(event);
    }
}
