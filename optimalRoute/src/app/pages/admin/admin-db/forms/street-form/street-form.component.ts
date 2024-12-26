import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { TypeFuel } from '../../../../../models/driver.model';
import { allowOnlyDigits, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Street } from '../../../../../models/street.model';

@Component({
    selector: 'app-street-form',
    standalone: true,
    imports: [NgbDropdownModule, ReactiveFormsModule, NgbPaginationModule],
    templateUrl: './street-form.component.html',
    styleUrl: '../forms.scss',
})
export class StreetFormComponent implements OnInit, AfterViewInit {
    @Input() activeRightElement = 1;
    @Output() activeRightElementChange = new EventEmitter<number>();

    private fb = inject(FormBuilder);

    httpService = inject(HttpService);

    isStreetEdit = false;

    editStreetNumber = 0;

    pageStreetsShowing: Street[] = [];

    streetsArrSize = 0;

    streetsTabPage = 1;

    streets: Street[] = [];

    streetAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(30)]],
    });

    streetEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
        }>
    >([]);

    constructor() {
        this.httpService.getStreets().subscribe(streets => {
            this.streets = streets;
            this.streetsArrSize = this.streets.length;
            this.streets.forEach(street => {
                const addedStreetGroup = this.fb.nonNullable.group({
                    name: [street.name, [Validators.required, stringRangeValidator(30)]],
                });
                addedStreetGroup.disable();

                this.streetEditForm.push(addedStreetGroup);
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

    addStreet() {
        const control = this.streetAddForm.controls;

        const addedStreet = {
            id_street: 0,
            name: control.name.value,
        };

        this.streets.push(addedStreet);

        this.httpService.addMapDbValue<Street>(addedStreet, 'street');

        const addedStreetGroup = this.fb.nonNullable.group({
            name: [control.name.value, [Validators.required, stringRangeValidator(30)]],
        });
        addedStreetGroup.disable();

        this.streetEditForm.push(addedStreetGroup);

        this.streetAddForm.reset();

        this.streetsArrSize++;
    }

    //TODO
    editStreet() {
        const control = this.streetEditForm.controls[this.editStreetNumber].controls;

        const id = this.streets[this.editStreetNumber].id_street;

        this.streets[this.editStreetNumber] = {
            id_street: id,
            name: control.name.value,
        };

        this.isStreetEdit = false;
        this.streetEditForm.controls[this.editStreetNumber].disable();
    }

    cancelEditStreet() {
        this.streetEditForm.controls[this.editStreetNumber].setValue({
            name: this.streets[this.editStreetNumber].name,
        });

        this.isStreetEdit = false;
        this.streetEditForm.controls[this.editStreetNumber].disable();
    }

    //TODO
    streetDelete(index: number) {
        this.streets.splice(index, 1);
        this.streetEditForm.controls.splice(index, 1);
        this.streetsArrSize--;
    }

    streetDuplicateValidation(
        formGroup: FormGroup<{
            name: FormControl<string>;
        }>,
        editIndex?: number
    ) {
        let hasDuplicate = false;

        this.streets.forEach((street, index) => {
            if (editIndex === undefined || editIndex !== index) {
                if (formGroup.controls.name.value === street.name) {
                    hasDuplicate = true;
                    return;
                }
            }
        });

        return hasDuplicate;
    }

    //Шаблон не видит импортируемые функции
    isRequiredStreetError(form: FormGroup) {
        return isRequiredError(form);
    }
}