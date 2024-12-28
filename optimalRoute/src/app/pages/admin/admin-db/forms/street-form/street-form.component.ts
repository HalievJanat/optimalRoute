import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { TypeFuel } from '../../../../../models/driver.model';
import { allowOnlyDigits, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Street } from '../../../../../models/street.model';
import { ToastrService } from 'ngx-toastr';
import { UDS } from '../../../../../models/UDS.model';
import { ModalConfirmComponent } from '../../../../../modals/modal-confirm/modal-confirm.component';

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

    isgetErr = false;

    toastr = inject(ToastrService);

    isStreetEdit = false;

    editStreetNumber = 0;

    pageStreetsShowing: Street[] = [];

    streetsArrSize = 0;

    streetsTabPage = 1;

    streets: Street[] = [];
    udsList: UDS[] = []; //для каскадного удаления

    streetAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(30)]],
    });

    streetEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
        }>
    >([]);

    constructor(private modalService: NgbModal) {
        this.httpService.getUDSList().subscribe({
            next: udsList => {
                this.udsList = udsList;
            },
            error: () => {
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                this.isgetErr = true;
            },
        });

        this.httpService.getStreets().subscribe({
            next: streets => {
                this.streets = streets;
                this.streetsArrSize = this.streets.length;
                this.streets.forEach(street => {
                    const addedStreetGroup = this.fb.nonNullable.group({
                        name: [street.name, [Validators.required, stringRangeValidator(30)]],
                    });
                    addedStreetGroup.disable();

                    this.streetEditForm.push(addedStreetGroup);
                });
            },
            error: _ => {
                if (this.isgetErr) {
                    return;
                }
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
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

    addStreet() {
        if (this.isgetErr) {
            this.streetAddForm.reset();
            this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
            return;
        }

        const control = this.streetAddForm.controls;

        const addedStreet = {
            id_street: this.streets.length ? this.streets[this.streets.length - 1].id_street + 1 : 0,
            name: control.name.value,
        };

        this.httpService.addMapDbValue<Street>(addedStreet, 'street').subscribe({
            next: () => {
                this.streets.push(addedStreet);

                const addedStreetGroup = this.fb.nonNullable.group({
                    name: [control.name.value, [Validators.required, stringRangeValidator(30)]],
                });
                addedStreetGroup.disable();

                this.streetEditForm.push(addedStreetGroup);

                this.streetAddForm.reset();

                this.streetsArrSize++;
            },
            error: () => {
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                this.streetAddForm.reset();
            },
        });
    }

    editStreet() {
        const control = this.streetEditForm.controls[this.editStreetNumber].controls;

        const id = this.streets[this.editStreetNumber].id_street;

        const editStreet = {
            id_street: id,
            name: control.name.value,
        };

        this.httpService.updateMapDbValue<Street>(editStreet, 'street').subscribe({
            next: () => {
                this.streets[this.editStreetNumber] = editStreet;

                this.isStreetEdit = false;
                this.streetEditForm.controls[this.editStreetNumber].disable();
            },
            error: () => {
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                this.cancelEditStreet();
                this.isStreetEdit = false;
                this.streetEditForm.controls[this.editStreetNumber].disable();
            },
        });
    }

    cancelEditStreet() {
        this.streetEditForm.controls[this.editStreetNumber].setValue({
            name: this.streets[this.editStreetNumber].name,
        });

        this.isStreetEdit = false;
        this.streetEditForm.controls[this.editStreetNumber].disable();
    }

    streetDelete(index: number) {
        const modalRef = this.modalService.open(ModalConfirmComponent, {
            centered: true,
        });
        modalRef.componentInstance.deletedObj = this.streets[index].name;
        modalRef.componentInstance.relatedObjects = [];

        for (let uds of this.udsList) {
            for (let road of uds.roads) {
                if (road.street.id_street === this.streets[index].id_street) {
                    modalRef.componentInstance.relatedObjects.push('Карта' + ' ' + uds.name);
                    break;
                }
            }
        }

        modalRef.result
            .then(() => {
                this.httpService.deleteMapDbValue(this.streets[index], 'street').subscribe({
                    next: () => {
                        this.httpService.getUDSList().subscribe({
                            next: udsList => {
                                this.udsList = udsList;

                                this.httpService.getStreets().subscribe({
                                    next: streets => {
                                        this.streets = streets;

                                        this.streets.splice(index, 1);
                                        this.streetEditForm.controls.splice(index, 1);
                                        this.streetsArrSize--;
                                    },
                                });
                            },
                        });
                    },
                    error: () => {
                        this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                    },
                });
            })
            .catch(() => {});
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
