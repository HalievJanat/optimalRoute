import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { TypeFuel } from '../../../../../models/driver.model';
import { allowOnlyDigits, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../../../../modals/modal-confirm/modal-confirm.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-fuel-form',
    standalone: true,
    imports: [NgbDropdownModule, ReactiveFormsModule, NgbPaginationModule],
    templateUrl: './fuel-form.component.html',
    styleUrl: '../forms.scss',
})
export class FuelFormComponent implements OnInit, AfterViewInit {
    @Input() activeRightElement = 1;
    @Output() activeRightElementChange = new EventEmitter<number>();

    private fb = inject(FormBuilder);

    httpService = inject(HttpService);

    isgetErr = false;

    toastr = inject(ToastrService);

    isTypeFuelEdit = false;

    editTypeFuelNumber = 0;

    pageTypeFuelsShowing: TypeFuel[] = [];

    typeFuelsArrSize = 0;

    typeFuelsTabPage = 1;

    typeFuels: TypeFuel[] = [];

    typeFuelAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(15)]],
        price: [null as number | null, [Validators.required, rangeValidator(50, 150)]],
    });

    typeFuelEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
            price: FormControl<number | null>;
        }>
    >([]);

    constructor(private modalService: NgbModal) {
        this.httpService.getTypeFuels().subscribe({
            next: fuels => {
                this.typeFuels = fuels;
                this.typeFuelsArrSize = this.typeFuels.length;
                this.typeFuels.forEach(typeFuel => {
                    const addedTypeFuelGroup = this.fb.nonNullable.group({
                        name: [typeFuel.name, [Validators.required, stringRangeValidator(15)]],
                        price: [typeFuel.price as number | null, [Validators.required, rangeValidator(50, 150)]],
                    });
                    addedTypeFuelGroup.disable();

                    this.typeFuelEditForm.push(addedTypeFuelGroup);
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

    addTypeFuel() {
        if (this.isgetErr) {
            this.typeFuelAddForm.reset();
            this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            return;
        }

        const control = this.typeFuelAddForm.controls;

        const addedTypeFuel = {
            id_type_fuel: this.typeFuels[this.typeFuels.length - 1].id_type_fuel + 1,
            name: control.name.value,
            price: control.price.value as number,
        };

        this.httpService.addMapDbValue<TypeFuel>(addedTypeFuel, 'fuel').subscribe({
            next: () => {
                this.typeFuels.push(addedTypeFuel);

                const addedTypeFuelGroup = this.fb.nonNullable.group({
                    name: [control.name.value, [Validators.required, stringRangeValidator(15)]],
                    price: [control.price.value, [Validators.required, rangeValidator(50, 150)]],
                });
                addedTypeFuelGroup.disable();

                this.typeFuelEditForm.push(addedTypeFuelGroup);

                this.typeFuelAddForm.reset();

                this.typeFuelsArrSize++;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.typeFuelAddForm.reset();
            },
        });
    }

    editTypeFuel() {
        const control = this.typeFuelEditForm.controls[this.editTypeFuelNumber].controls;

        const id = this.typeFuels[this.editTypeFuelNumber].id_type_fuel;

        const editFuel = {
            id_type_fuel: id,
            name: control.name.value,
            price: control.price.value as number,
        };

        this.httpService.updateMapDbValue<TypeFuel>(editFuel, 'fuel').subscribe({
            next: () => {
                this.typeFuels[this.editTypeFuelNumber] = editFuel;

                this.isTypeFuelEdit = false;
                this.typeFuelEditForm.controls[this.editTypeFuelNumber].disable();
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.cancelEditTypeFuel();
                this.isTypeFuelEdit = false;
                this.typeFuelEditForm.controls[this.editTypeFuelNumber].disable();
            },
        });
    }

    cancelEditTypeFuel() {
        this.typeFuelEditForm.controls[this.editTypeFuelNumber].setValue({
            name: this.typeFuels[this.editTypeFuelNumber].name,
            price: this.typeFuels[this.editTypeFuelNumber].price,
        });

        this.isTypeFuelEdit = false;
        this.typeFuelEditForm.controls[this.editTypeFuelNumber].disable();
    }

    typeFuelDelete(index: number) {
        this.httpService.deleteMapDbValue(this.typeFuels[index], 'fuel').subscribe({
            next: () => {
                this.typeFuels.splice(index, 1);
                this.typeFuelEditForm.controls.splice(index, 1);
                this.typeFuelsArrSize--;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            },
        });

        // const modalRef = this.modalService.open(ModalConfirmComponent, {
        //     centered: true,
        // });
        // modalRef.componentInstance.deletedObj = this.typeFuels[index].name;

        // modalRef.result
        //     .then(() => {
        //         this.typeFuels.splice(index, 1);
        //         this.typeFuelEditForm.controls.splice(index, 1);
        //         this.typeFuelsArrSize--;
        //     })
        //     .catch(() => {});
    }

    typeFuelDuplicateValidation(
        formGroup: FormGroup<{
            name: FormControl<string>;
            price: FormControl<number | null>;
        }>,
        editIndex?: number
    ) {
        let hasDuplicate = false;

        this.typeFuels.forEach((typeFuel, index) => {
            if (editIndex === undefined || editIndex !== index) {
                if (formGroup.controls.name.value === typeFuel.name) {
                    hasDuplicate = true;
                    return;
                }
            }
        });

        return hasDuplicate;
    }

    //Шаблон не видит импортируемые функции
    isRequiredFuelError(form: FormGroup) {
        return isRequiredError(form);
    }

    allowOnlyDigitsFuel(event: KeyboardEvent): void {
        allowOnlyDigits(event);
    }
}
