import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { Driver, TypeFuel, Vehicle } from '../../../../../models/driver.model';
import { allowOnlyDigits, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalDeleteConfirmComponent } from '../../../../../modals/modal-delete-confirm/modal-delete-confirm.component';

@Component({
    selector: 'app-vehicle-form',
    standalone: true,
    imports: [NgbDropdownModule, ReactiveFormsModule, NgbPaginationModule],
    templateUrl: './vehicle-form.component.html',
    styleUrl: '../forms.scss',
})
export class VehicleFormComponent implements OnInit, AfterViewInit {
    @Input() activeRightElement = 1;
    @Output() activeRightElementChange = new EventEmitter<number>();

    isgetErr = false;

    toastr = inject(ToastrService);

    private fb = inject(FormBuilder);

    httpService = inject(HttpService);

    isVehicleEdit = false;

    editVehicleNumber = 0;

    pageVehiclesShowing: Vehicle[] = [];

    vehiclesArrSize = 0;

    vehiclesTabPage = 1;

    vehicles: Vehicle[] = [];

    typeFuels: TypeFuel[] = [];

    drivers: Driver[] = []; //для каскадного удаления

    vehicleAddForm = this.fb.nonNullable.group({
        brand: ['', [Validators.required, stringRangeValidator(15, 3)]],
        typeFuel: ['', Validators.required],
        consumption_fuel: [null as number | null, [Validators.required, rangeValidator(1, 20)]],
        max_speed: [null as number | null, [Validators.required, rangeValidator(1, 300)]],
    });

    vehicleEditForm = this.fb.array<
        FormGroup<{
            brand: FormControl<string>;
            typeFuel: FormControl<string>;
            consumption_fuel: FormControl<number | null>;
            max_speed: FormControl<number | null>;
        }>
    >([]);

    constructor(private modalService: NgbModal) {
        this.httpService.getDrivers().subscribe({
            next: drivers => {
                this.drivers = drivers;
            },
            error: () => {
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                this.isgetErr = true;
            },
        });

        this.httpService.getTypeFuels().subscribe({
            next: typeFuels => {
                this.typeFuels = typeFuels;
            },
            error: () => {
                if (this.isgetErr) {
                    return;
                }
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                this.isgetErr = true;
            },
        });

        this.httpService.getVehicles().subscribe({
            next: vehicles => {
                this.vehicles = vehicles;
                this.vehiclesArrSize = this.vehicles.length;
                this.vehicles.forEach(vehicle => {
                    const addedVehicleGroup = this.fb.nonNullable.group({
                        brand: [vehicle.brand, [Validators.required, stringRangeValidator(15, 3)]],
                        typeFuel: [vehicle.type_fuel.name, Validators.required],
                        consumption_fuel: [vehicle.consumption_fuel as number | null, [Validators.required, rangeValidator(1, 20)]],
                        max_speed: [vehicle.max_speed as number | null, [Validators.required, rangeValidator(1, 300)]],
                    });
                    addedVehicleGroup.disable();

                    this.vehicleEditForm.push(addedVehicleGroup);
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

    addVehicle() {
        if (this.isgetErr) {
            this.vehicleAddForm.reset();
            this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
            return;
        }

        const control = this.vehicleAddForm.controls;

        const vehicleFuel = this.typeFuels.find(typeFuel => typeFuel.name === control.typeFuel.value) as TypeFuel;

        const addedVehicle = {
            id_vehicle: this.vehicles.length ? this.vehicles[this.vehicles.length - 1].id_vehicle + 1 : 0,
            brand: control.brand.value,
            type_fuel: vehicleFuel,
            consumption_fuel: control.consumption_fuel.value as unknown as number,
            max_speed: control.max_speed.value as unknown as number,
        };

        this.httpService.addMapDbValue<Vehicle>(addedVehicle, 'car').subscribe({
            next: () => {
                this.vehicles.push(addedVehicle);
                const addedVehicleGroup = this.fb.nonNullable.group({
                    brand: [control.brand.value, [Validators.required, stringRangeValidator(15, 3)]],
                    typeFuel: [control.typeFuel.value, Validators.required],
                    consumption_fuel: [control.consumption_fuel.value as number | null, [Validators.required, rangeValidator(1, 20)]],
                    max_speed: [control.max_speed.value as number | null, [Validators.required, rangeValidator(1, 300)]],
                });
                addedVehicleGroup.disable();

                this.vehicleEditForm.push(addedVehicleGroup);

                this.vehicleAddForm.reset();

                this.vehiclesArrSize++;
            },
            error: () => {
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                this.vehicleAddForm.reset();
            },
        });
    }

    editVehicle() {
        const control = this.vehicleEditForm.controls[this.editVehicleNumber].controls;

        const vehicleFuel = this.typeFuels.find(typeFuel => typeFuel.name === control.typeFuel.value) as TypeFuel;

        const id = this.vehicles[this.editVehicleNumber].id_vehicle;
        const editVehicle = {
            id_vehicle: id,
            brand: control.brand.value,
            type_fuel: vehicleFuel,
            consumption_fuel: control.consumption_fuel.value as unknown as number,
            max_speed: control.max_speed.value as unknown as number,
        };

        this.httpService.updateMapDbValue<Vehicle>(editVehicle, 'car').subscribe({
            next: () => {
                this.vehicles[this.editVehicleNumber] = editVehicle;

                this.isVehicleEdit = false;
                this.vehicleEditForm.controls[this.editVehicleNumber].disable();
            },
            error: () => {
                this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                this.cancelEditVehicle();
                this.isVehicleEdit = false;
                this.vehicleEditForm.controls[this.editVehicleNumber].disable();
            },
        });
    }

    cancelEditVehicle() {
        this.vehicleEditForm.controls[this.editVehicleNumber].setValue({
            brand: this.vehicles[this.editVehicleNumber].brand,
            typeFuel: this.vehicles[this.editVehicleNumber].type_fuel.name,
            consumption_fuel: this.vehicles[this.editVehicleNumber].consumption_fuel,
            max_speed: this.vehicles[this.editVehicleNumber].max_speed,
        });

        this.isVehicleEdit = false;
        this.vehicleEditForm.controls[this.editVehicleNumber].disable();
    }

    vehicleDelete(index: number) {
        const modalRef = this.modalService.open(ModalDeleteConfirmComponent, {
            centered: true,
        });
        modalRef.componentInstance.deletedObj = this.vehicles[index].brand;
        modalRef.componentInstance.relatedObjects = [];

        this.drivers.forEach(driver => {
            if (driver.vehicle.id_vehicle === this.vehicles[index].id_vehicle) {
                modalRef.componentInstance.relatedObjects.push('Водитель' + ' ' + driver.family + ' ' + driver.name + ' ' + driver.surname);
            }
        });

        modalRef.result
            .then(() => {
                this.httpService.deleteMapDbValue(this.vehicles[index], 'car').subscribe({
                    next: () => {
                        this.httpService.getDrivers().subscribe({
                            next: drivers => {
                                this.drivers = drivers;

                                this.httpService.getVehicles().subscribe({
                                    next: vehicles => {
                                        this.vehicles = vehicles;

                                        this.vehicleEditForm.controls.splice(index, 1);
                                        this.vehiclesArrSize--;
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

    vehicleDuplicateValidation(
        formGroup: FormGroup<{
            brand: FormControl<string>;
            typeFuel: FormControl<string>;
            consumption_fuel: FormControl<number | null>;
            max_speed: FormControl<number | null>;
        }>,
        editIndex?: number
    ) {
        let hasDuplicate = false;

        this.vehicles.forEach((vehicle, index) => {
            if (editIndex === undefined || editIndex !== index) {
                if (formGroup.controls.brand.value === vehicle.brand) {
                    hasDuplicate = true;
                    return;
                }
            }
        });

        return hasDuplicate;
    }

    //Шаблон не видит импортируемые функции
    isRequiredVehicleError(form: FormGroup) {
        return isRequiredError(form);
    }

    allowOnlyDigitsVehicle(event: KeyboardEvent): void {
        allowOnlyDigits(event);
    }
}
