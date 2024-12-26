import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { floatValidator, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TypeCover } from '../../../../../models/cover-type.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-cover-form',
    standalone: true,
    imports: [NgbDropdownModule, ReactiveFormsModule, NgbPaginationModule],
    templateUrl: './cover-form.component.html',
    styleUrl: '../forms.scss',
})
export class CoverFormComponent implements OnInit, AfterViewInit {
    @Input() activeRightElement = 1;
    @Output() activeRightElementChange = new EventEmitter<number>();

    private fb = inject(FormBuilder);

    httpService = inject(HttpService);

    isgetErr = false;

    toastr = inject(ToastrService);

    isCoverTypeEdit = false;

    editCoverTypeNumber = 0;

    pageCoverTypeShowing: TypeCover[] = [];

    coverTypesArrSize = 0;

    coverTypesTabPage = 1;

    coverTypes: TypeCover[] = [];

    coverTypeAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(30)]],
        coefficient_braking: [null as number | null, [Validators.required, rangeValidator(1, 2), floatValidator()]],
    });

    coverTypeEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
            coefficient_braking: FormControl<number | null>;
        }>
    >([]);

    constructor() {
        this.httpService.getTypeCovers().subscribe({
            next: coverTypes => {
                this.coverTypes = coverTypes;
                this.coverTypesArrSize = this.coverTypes.length;
                this.coverTypes.forEach(coverType => {
                    const addedCoverTypeGroup = this.fb.nonNullable.group({
                        name: [coverType.name, [Validators.required, stringRangeValidator(30)]],
                        coefficient_braking: [
                            coverType.coefficient_braking as number | null,
                            [Validators.required, rangeValidator(1, 2), floatValidator()],
                        ],
                    });
                    addedCoverTypeGroup.disable();

                    this.coverTypeEditForm.push(addedCoverTypeGroup);
                });
            },
            error: _ => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.isgetErr = true;
            },
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

    addCoverType() {
        if (this.isgetErr) {
            this.coverTypeAddForm.reset();
            this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            return;
        }

        const control = this.coverTypeAddForm.controls;

        const addedCoverType = {
            id_type_cover: this.coverTypes[this.coverTypes.length - 1].id_type_cover + 1,
            name: control.name.value,
            coefficient_braking: control.coefficient_braking.value as number,
        };

        this.httpService.addMapDbValue<TypeCover>(addedCoverType, 'coverage').subscribe({
            next: () => {
                this.coverTypes.push(addedCoverType);

                const addedCoverTypeGroup = this.fb.nonNullable.group({
                    name: [control.name.value, [Validators.required, stringRangeValidator(30)]],
                    coefficient_braking: [control.coefficient_braking.value, [Validators.required, rangeValidator(1, 2), floatValidator()]],
                });
                addedCoverTypeGroup.disable();

                this.coverTypeEditForm.push(addedCoverTypeGroup);

                this.coverTypeAddForm.reset();

                this.coverTypesArrSize++;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.coverTypeAddForm.reset();
            },
        });
    }

    editCoverType() {
        const control = this.coverTypeEditForm.controls[this.editCoverTypeNumber].controls;

        const id = this.coverTypes[this.editCoverTypeNumber].id_type_cover;

        const editCover = {
            id_type_cover: id,
            name: control.name.value,
            coefficient_braking: control.coefficient_braking.value as number,
        };

        this.httpService.updateMapDbValue<TypeCover>(editCover, 'coverage').subscribe({
            next: () => {
                this.coverTypes[this.editCoverTypeNumber] = editCover;

                this.isCoverTypeEdit = false;
                this.coverTypeEditForm.controls[this.editCoverTypeNumber].disable();
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.cancelEditCoverType();
                this.isCoverTypeEdit = false;
                this.coverTypeEditForm.controls[this.editCoverTypeNumber].disable();
            },
        });
    }

    cancelEditCoverType() {
        this.coverTypeEditForm.controls[this.editCoverTypeNumber].setValue({
            name: this.coverTypes[this.editCoverTypeNumber].name,
            coefficient_braking: this.coverTypes[this.editCoverTypeNumber].coefficient_braking,
        });

        this.isCoverTypeEdit = false;
        this.coverTypeEditForm.controls[this.editCoverTypeNumber].disable();
    }

    coverTypeDelete(index: number) {
        this.httpService.deleteMapDbValue(this.coverTypes[index], 'coverage').subscribe({
            next: () => {
                this.coverTypes.splice(index, 1);
                this.coverTypeEditForm.controls.splice(index, 1);
                this.coverTypesArrSize--;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            },
        });
    }

    coverTypeDuplicateValidation(
        formGroup: FormGroup<{
            name: FormControl<string>;
            coefficient_braking: FormControl<number | null>;
        }>,
        editIndex?: number
    ) {
        let hasDuplicate = false;

        this.coverTypes.forEach((coverType, index) => {
            if (editIndex === undefined || editIndex !== index) {
                if (formGroup.controls.name.value === coverType.name) {
                    hasDuplicate = true;
                    return;
                }
            }
        });

        return hasDuplicate;
    }

    //Шаблон не видит импортируемые функции
    isRequiredCoverError(form: FormGroup) {
        return isRequiredError(form);
    }
}
