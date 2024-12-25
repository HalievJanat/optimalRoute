import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { floatValidator, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DegreeCorruption } from '../../../../../models/police-post.model';

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
        this.httpService.getDegreeCorruptions().subscribe(corruptionDegrees => {
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
        const control = this.corruptionDegreeAddForm.controls;

        const addedCorruptionDegree = {
            id_corruption: 0,
            name: control.name.value,
            coefficient_corruption: control.coefficient_corruption.value as number,
        };

        this.corruptionDegrees.push(addedCorruptionDegree);

        this.httpService.addMapDbValue<DegreeCorruption>(addedCorruptionDegree, 'corruption');

        const addedCorruptionDegreeGroup = this.fb.nonNullable.group({
            name: [control.name.value, [Validators.required, stringRangeValidator(30)]],
            coefficient_corruption: [control.coefficient_corruption.value, [Validators.required, rangeValidator(1, 2), floatValidator()]],
        });
        addedCorruptionDegreeGroup.disable();

        this.corruptionDegreeEditForm.push(addedCorruptionDegreeGroup);

        this.corruptionDegreeAddForm.reset();

        this.corruptionDegreeArrSize++;
    }

    //TODO v bd net
    editCorruptionDegree() {
        const control = this.corruptionDegreeEditForm.controls[this.editCorruptionDegreeNumber].controls;

        const id = this.corruptionDegrees[this.editCorruptionDegreeNumber].id_corruption;

        this.corruptionDegrees[this.editCorruptionDegreeNumber] = {
            id_corruption: id,
            name: control.name.value,
            coefficient_corruption: control.coefficient_corruption.value as number,
        };

        this.isCorruptionDegreeEdit = false;
        this.corruptionDegreeEditForm.controls[this.editCorruptionDegreeNumber].disable();
    }

    cancelEditCorruptionDegree() {
        this.corruptionDegreeEditForm.controls[this.editCorruptionDegreeNumber].setValue({
            name: this.corruptionDegrees[this.editCorruptionDegreeNumber].name,
            coefficient_corruption: this.corruptionDegrees[this.editCorruptionDegreeNumber].coefficient_corruption,
        });

        this.isCorruptionDegreeEdit = false;
        this.corruptionDegreeEditForm.controls[this.editCorruptionDegreeNumber].disable();
    }

    //TODO v bd net
    corruptionDegreeDelete(index: number) {
        this.corruptionDegrees.splice(index, 1);
        this.corruptionDegreeEditForm.controls.splice(index, 1);
        this.corruptionDegreeArrSize--;
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
