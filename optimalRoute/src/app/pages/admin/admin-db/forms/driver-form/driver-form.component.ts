import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { Driver, Vehicle } from '../../../../../models/driver.model';
import { isRequiredError, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-driver-form',
    standalone: true,
    imports: [NgbDropdownModule, ReactiveFormsModule, NgbPaginationModule],
    templateUrl: './driver-form.component.html',
    styleUrl: '../forms.scss',
})
export class DriverFormComponent implements OnInit, AfterViewInit {
    @Input() activeRightElement = 1;
    @Output() activeRightElementChange = new EventEmitter<number>();

    private fb = inject(FormBuilder);

    httpService = inject(HttpService);

    isgetErr = false;

    toastr = inject(ToastrService);

    isDriverEdit = false;

    editDriverNumber = 0;

    pageDriversShowing: Driver[] = [];

    driversArrSize = 0;

    driverTabPage = 1;

    drivers: Driver[] = [];

    vehicles: Vehicle[] = [];

    driverAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(15)]],
        surname: ['', [Validators.required, stringRangeValidator(20)]],
        family: ['', [Validators.required, stringRangeValidator(15)]],
        infringer: false,
        vehicle: ['', Validators.required],
    });

    driverEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
            surname: FormControl<string>;
            family: FormControl<string>;
            infringer: FormControl<boolean>;
            vehicle: FormControl<string>;
        }>
    >([]);

    constructor() {
        this.httpService.getVehicles().subscribe({
            next: vehicles => {
                this.vehicles = vehicles;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.isgetErr = true;
            },
        });

        this.httpService.getDrivers().subscribe({
            next: drivers => {
                this.drivers = drivers;
                this.driversArrSize = this.drivers.length;
                this.drivers.forEach(driver => {
                    const addedDriverGroup = this.fb.nonNullable.group({
                        name: [driver.name, [Validators.required, stringRangeValidator(15)]],
                        surname: [driver.surname, [Validators.required, stringRangeValidator(20)]],
                        family: [driver.family, [Validators.required, stringRangeValidator(15)]],
                        infringer: [driver.infringer, Validators.required],
                        vehicle: [driver.vehicle.brand, Validators.required],
                    });
                    addedDriverGroup.disable();

                    this.driverEditForm.push(addedDriverGroup);
                });
            },
            error: _ => {
                if (this.isgetErr) {
                    return;
                }
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

    addDriver() {
        if (this.isgetErr) {
            this.driverAddForm.reset();
            this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            return;
        }

        const control = this.driverAddForm.controls;
        const driverAuto = this.vehicles.find(vehicle => vehicle.brand === control.vehicle.value) as Vehicle;

        const addedDriver = {
            id_driver: this.drivers.length ? 0 : this.drivers[this.drivers.length - 1].id_driver,
            name: control.name.value,
            surname: control.surname.value,
            family: control.family.value,
            infringer: control.infringer.value,
            vehicle: driverAuto,
        };

        this.httpService.addMapDbValue<Driver>(addedDriver, 'driver').subscribe({
            next: () => {
                this.drivers.push(addedDriver);
                const addedDriverGroup = this.fb.nonNullable.group({
                    name: [control.name.value, [Validators.required, stringRangeValidator(15)]],
                    surname: [control.surname.value, [Validators.required, stringRangeValidator(20)]],
                    family: [control.family.value, [Validators.required, stringRangeValidator(15)]],
                    infringer: [control.infringer.value, Validators.required],
                    vehicle: [driverAuto.brand, Validators.required],
                });
                addedDriverGroup.disable();

                this.driverEditForm.push(addedDriverGroup);

                this.driverAddForm.reset();

                this.driversArrSize++;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.driverAddForm.reset();
            },
        });
    }

    editDriver() {
        const control = this.driverEditForm.controls[this.editDriverNumber].controls;

        const driverAuto = this.vehicles.find(vehicle => vehicle.brand === control.vehicle.value) as Vehicle;

        const id = this.drivers[this.editDriverNumber].id_driver;

        const editDriver = {
            id_driver: id,
            name: control.name.value,
            surname: control.surname.value,
            family: control.family.value,
            infringer: control.infringer.value,
            vehicle: driverAuto,
        };

        this.httpService.updateMapDbValue<Driver>(editDriver, 'driver').subscribe({
            next: () => {
                this.drivers[this.editDriverNumber] = editDriver;

                this.isDriverEdit = false;
                this.driverEditForm.controls[this.editDriverNumber].disable();
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.cancelEditDriver();
                this.isDriverEdit = false;
                this.driverEditForm.controls[this.editDriverNumber].disable();
            },
        });
    }

    cancelEditDriver() {
        this.driverEditForm.controls[this.editDriverNumber].setValue({
            name: this.drivers[this.editDriverNumber].name,
            surname: this.drivers[this.editDriverNumber].surname,
            family: this.drivers[this.editDriverNumber].family,
            infringer: this.drivers[this.editDriverNumber].infringer,
            vehicle: this.drivers[this.editDriverNumber].vehicle.brand,
        });

        this.isDriverEdit = false;
        this.driverEditForm.controls[this.editDriverNumber].disable();
    }

    driverDelete(index: number) {
        this.httpService.deleteMapDbValue(this.drivers[index], 'driver').subscribe({
            next: () => {
                this.drivers.splice(index, 1);
                this.driverEditForm.controls.splice(index, 1);
                this.driversArrSize--;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            },
        });
    }

    driverDuplicateValidation(
        formGroup: FormGroup<{
            name: FormControl<string>;
            surname: FormControl<string>;
            family: FormControl<string>;
            infringer: FormControl<boolean>;
            vehicle: FormControl<string>;
        }>,
        editIndex?: number
    ) {
        let hasDuplicate = false;
        this.drivers.forEach((driver, index) => {
            if (editIndex === undefined || editIndex !== index) {
                if (
                    formGroup.controls.family.value === driver.family &&
                    formGroup.controls.surname.value === driver.surname &&
                    formGroup.controls.name.value === driver.name
                ) {
                    hasDuplicate = true;
                    return;
                }
            }
        });

        return hasDuplicate;
    }

    //Шаблон не видит импортируемые функции
    isRequiredDriverError(form: FormGroup) {
        return isRequiredError(form);
    }
}
