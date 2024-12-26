import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { TypeFuel, Vehicle } from '../../../../../models/driver.model';
import { allowOnlyDigits, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

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

    private fb = inject(FormBuilder);

    httpService = inject(HttpService);

    isVehicleEdit = false;

    editVehicleNumber = 0;

    pageVehiclesShowing: Vehicle[] = [];

    vehiclesArrSize = 0;

    vehiclesTabPage = 1;

    vehicles: Vehicle[] = [];

    typeFuels: TypeFuel[] = [];

    vehicleAddForm = this.fb.nonNullable.group({
        brand: ['', [Validators.required, stringRangeValidator(15)]],
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

    constructor() {
        this.httpService.getTypeFuels().subscribe(typeFuels => {
            this.typeFuels = typeFuels;
        });

        this.httpService.getVehicles().subscribe(vehicles => {
            this.vehicles = vehicles;
            this.vehiclesArrSize = this.vehicles.length;
            this.vehicles.forEach(vehicle => {
                const addedVehicleGroup = this.fb.nonNullable.group({
                    brand: [vehicle.brand, [Validators.required, stringRangeValidator(15)]],
                    typeFuel: [vehicle.type_fuel.name, Validators.required],
                    consumption_fuel: [vehicle.consumption_fuel as number | null, [Validators.required, rangeValidator(1, 20)]],
                    max_speed: [vehicle.max_speed as number | null, [Validators.required, rangeValidator(1, 300)]],
                });
                addedVehicleGroup.disable();

                this.vehicleEditForm.push(addedVehicleGroup);
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

    addVehicle() {
        const control = this.vehicleAddForm.controls;

        const vehicleFuel = this.typeFuels.find(typeFuel => typeFuel.name === control.typeFuel.value) as TypeFuel;

        const addedVehicle = {
            id_vehicle: 0,
            brand: control.brand.value,
            type_fuel: vehicleFuel,
            consumption_fuel: control.consumption_fuel.value as unknown as number,
            max_speed: control.max_speed.value as unknown as number,
        };

        this.vehicles.push(addedVehicle);

        this.httpService.addMapDbValue<Vehicle>(addedVehicle, 'car');

        const addedVehicleGroup = this.fb.nonNullable.group({
            brand: [control.brand.value, [Validators.required, stringRangeValidator(15)]],
            typeFuel: [control.typeFuel.value, Validators.required],
            consumption_fuel: [control.consumption_fuel.value as number | null, [Validators.required, rangeValidator(1, 20)]],
            max_speed: [control.max_speed.value as number | null, [Validators.required, rangeValidator(1, 300)]],
        });
        addedVehicleGroup.disable();

        this.vehicleEditForm.push(addedVehicleGroup);

        this.vehicleAddForm.reset();

        this.vehiclesArrSize++;
    }

    //TODO с бд пока нет редактирования
    editVehicle() {
        const control = this.vehicleEditForm.controls[this.editVehicleNumber].controls;

        const vehicleFuel = this.typeFuels.find(typeFuel => typeFuel.name === control.typeFuel.value) as TypeFuel;

        const id = this.vehicles[this.editVehicleNumber].id_vehicle;

        this.vehicles[this.editVehicleNumber] = {
            id_vehicle: id,
            brand: control.brand.value,
            type_fuel: vehicleFuel,
            consumption_fuel: control.consumption_fuel.value as unknown as number,
            max_speed: control.max_speed.value as unknown as number,
        };

        this.isVehicleEdit = false;
        this.vehicleEditForm.controls[this.editVehicleNumber].disable();
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

    //TODO в бд пока нет
    vehicleDelete(index: number) {
        this.vehicles.splice(index, 1);
        this.vehicleEditForm.controls.splice(index, 1);
        this.vehiclesArrSize--;
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