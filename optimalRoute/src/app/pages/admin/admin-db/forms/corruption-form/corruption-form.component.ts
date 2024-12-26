import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { floatValidator, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DegreeCorruption } from '../../../../../models/police-post.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-corruption-form',
    standalone: true,
    imports: [NgbDropdownModule, ReactiveFormsModule, NgbPaginationModule],
    templateUrl: './corruption-form.component.html',
    styleUrl: '../forms.scss',
})
export class CorruptionFormComponent implements OnInit, AfterViewInit {
    @Input() activeRightElement = 1;
    @Output() activeRightElementChange = new EventEmitter<number>();

    private fb = inject(FormBuilder);

    httpService = inject(HttpService);

    isgetErr = false;

    toastr = inject(ToastrService);

    isCorruptionDegreeEdit = false;

    editCorruptionDegreeNumber = 0;

    pageCorruptionDegreeShowing: DegreeCorruption[] = [];

    corruptionDegreeArrSize = 0;

    corruptionDegreesTabPage = 1;

    corruptionDegrees: DegreeCorruption[] = [];

    corruptionDegreeAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(30)]],
        coefficient_corruption: [null as number | null, [Validators.required, rangeValidator(1, 2), floatValidator()]],
    });

    corruptionDegreeEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
            coefficient_corruption: FormControl<number | null>;
        }>
    >([]);

    constructor() {
        this.httpService.getDegreeCorruptions().subscribe({
            next: corruptionDegrees => {
                this.corruptionDegrees = corruptionDegrees;
                this.corruptionDegreeArrSize = this.corruptionDegrees.length;
                this.corruptionDegrees.forEach(corruptionDegree => {
                    const addedCorruptionDegreeGroup = this.fb.nonNullable.group({
                        name: [corruptionDegree.name, [Validators.required, stringRangeValidator(30)]],
                        coefficient_corruption: [
                            corruptionDegree.coefficient_corruption as number | null,
                            [Validators.required, rangeValidator(1, 2), floatValidator()],
                        ],
                    });
                    addedCorruptionDegreeGroup.disable();

                    this.corruptionDegreeEditForm.push(addedCorruptionDegreeGroup);
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

    addCorruptionDegree() {
        if (this.isgetErr) {
            this.corruptionDegreeAddForm.reset();
            this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            return;
        }

        const control = this.corruptionDegreeAddForm.controls;

        const addedCorruptionDegree = {
            id_corruption:
                this.corruptionDegrees.length ? this.corruptionDegrees[this.corruptionDegrees.length - 1].id_corruption + 1 : 0,
            name: control.name.value,
            coefficient_corruption: control.coefficient_corruption.value as number,
        };

        this.httpService.addMapDbValue<DegreeCorruption>(addedCorruptionDegree, 'corruption').subscribe({
            next: () => {
                this.corruptionDegrees.push(addedCorruptionDegree);

                const addedCorruptionDegreeGroup = this.fb.nonNullable.group({
                    name: [control.name.value, [Validators.required, stringRangeValidator(30)]],
                    coefficient_corruption: [
                        control.coefficient_corruption.value,
                        [Validators.required, rangeValidator(1, 2), floatValidator()],
                    ],
                });
                addedCorruptionDegreeGroup.disable();

                this.corruptionDegreeEditForm.push(addedCorruptionDegreeGroup);

                this.corruptionDegreeAddForm.reset();

                this.corruptionDegreeArrSize++;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.corruptionDegreeAddForm.reset();
            },
        });
    }

    editCorruptionDegree() {
        const control = this.corruptionDegreeEditForm.controls[this.editCorruptionDegreeNumber].controls;

        const id = this.corruptionDegrees[this.editCorruptionDegreeNumber].id_corruption;

        const editCourruption = {
            id_corruption: id,
            name: control.name.value,
            coefficient_corruption: control.coefficient_corruption.value as number,
        };

        this.httpService.updateMapDbValue<DegreeCorruption>(editCourruption, 'corruption').subscribe({
            next: () => {
                this.corruptionDegrees[this.editCorruptionDegreeNumber] = editCourruption;

                this.isCorruptionDegreeEdit = false;
                this.corruptionDegreeEditForm.controls[this.editCorruptionDegreeNumber].disable();
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.cancelEditCorruptionDegree();
                this.isCorruptionDegreeEdit = false;
                this.corruptionDegreeEditForm.controls[this.editCorruptionDegreeNumber].disable();
            },
        });
    }

    cancelEditCorruptionDegree() {
        this.corruptionDegreeEditForm.controls[this.editCorruptionDegreeNumber].setValue({
            name: this.corruptionDegrees[this.editCorruptionDegreeNumber].name,
            coefficient_corruption: this.corruptionDegrees[this.editCorruptionDegreeNumber].coefficient_corruption,
        });

        this.isCorruptionDegreeEdit = false;
        this.corruptionDegreeEditForm.controls[this.editCorruptionDegreeNumber].disable();
    }

    corruptionDegreeDelete(index: number) {
        this.httpService.deleteMapDbValue(this.corruptionDegrees[index], 'corruption').subscribe({
            next: () => {
                this.corruptionDegrees.splice(index, 1);
                this.corruptionDegreeEditForm.controls.splice(index, 1);
                this.corruptionDegreeArrSize--;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            },
        });
    }

    corruptionDegreeDuplicateValidation(
        formGroup: FormGroup<{
            name: FormControl<string>;
            coefficient_corruption: FormControl<number | null>;
        }>,
        editIndex?: number
    ) {
        let hasDuplicate = false;

        this.corruptionDegrees.forEach((corruptionDegree, index) => {
            if (editIndex === undefined || editIndex !== index) {
                if (formGroup.controls.name.value === corruptionDegree.name) {
                    hasDuplicate = true;
                    return;
                }
            }
        });

        return hasDuplicate;
    }

    //Шаблон не видит импортируемые функции
    isRequiredCorruptionError(form: FormGroup) {
        return isRequiredError(form);
    }
}
