import { Component, inject, Type } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import {
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Driver, TypeFuel, Vehicle } from '../../../models/driver.model';
import { DegreeCorruption } from '../../../models/police-post.model';
import { Street } from '../../../models/street.model';
import { TypeCover } from '../../../models/cover-type.model';
import { TrafficLights } from '../../../models/traffic-light.model';
import { TypeFine } from '../../../models/fine-type.model';
import { HttpService } from '../../../services/http-service.service';
import { FuelType } from '../../../models/fuel-type.model';

@Component({
    selector: 'app-admin-db',
    standalone: true,
    imports: [
        HeaderComponent,
        NgbNavModule,
        NgbTypeaheadModule,
        NgbPaginationModule,
        NgbDropdownModule,
        ReactiveFormsModule,
    ],
    templateUrl: './admin-db.component.html',
    styleUrl: './admin-db.component.scss',
})
export class AdminDbComponent {
    activeRightElement = 1;

    private fb = inject(FormBuilder);
    httpService = inject(HttpService);

    isDriverEdit = false;

    editDriverNumber = 0;

    pageDriversShowing: Driver[] = [];

    driversArrSize = 0;

    driverTabPage = 1;

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

    isVehicleEdit = false;

    editVehicleNumber = 0;

    pageVehiclesShowing: Vehicle[] = [];

    vehiclesArrSize = 0;

    vehiclesTabPage = 1;

    vehicleAddForm = this.fb.nonNullable.group({
        brand: ['', [Validators.required, stringRangeValidator(15)]],
        typeFuel: ['', Validators.required],
        consumption_fuel: [1, [Validators.required, rangeValidator(1, 20)]],
        max_speed: [1, [Validators.required, rangeValidator(1, 300)]],
    });

    vehicleEditForm = this.fb.array<
        FormGroup<{
            brand: FormControl<string>;
            typeFuel: FormControl<string>;
            consumption_fuel: FormControl<number>;
            max_speed: FormControl<number>;
        }>
    >([]);

    isTypeFuelEdit = false;

    editTypeFuelNumber = 0;

    pageTypeFuelsShowing: TypeFuel[] = [];

    typeFuelsArrSize = 0;

    typeFuelsTabPage = 1;

    typeFuelAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(15)]],
        price: [50, [Validators.required, rangeValidator(50, 150)]],
    });

    typeFuelEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
            price: FormControl<number>;
        }>
    >([]);

    isCorruptionDegreeEdit = false;

    editCorruptionDegreeNumber = 0;

    pageCorruptionDegreeShowing: DegreeCorruption[] = [];

    corruptionDegreeArrSize = 0;

    corruptionDegreesTabPage = 1;

    corruptionDegreeAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(30)]],
        coefficient_corruption: [
            1,
            [Validators.required, rangeValidator(1, 2), floatValidator()],
        ],
    });

    corruptionDegreeEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
            coefficient_corruption: FormControl<number>;
        }>
    >([]);

    isStreetEdit = false;

    editStreetNumber = 0;

    pageStreetsShowing: Street[] = [];

    streetsArrSize = 0;

    streetsTabPage = 1;

    streetAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(30)]],
    });

    streetEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
        }>
    >([]);

    isCoverTypeEdit = false;

    editCoverTypeNumber = 0;

    pageCoverTypeShowing: TypeCover[] = [];

    coverTypesArrSize = 0;

    coverTypesTabPage = 1;

    coverTypeAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(30)]],
        coefficient_braking: [
            1,
            [Validators.required, rangeValidator(1, 2), floatValidator()],
        ],
    });

    coverTypeEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
            coefficient_braking: FormControl<number>;
        }>
    >([]);

    isTrafficLightEdit = false;

    editTrafficLightNumber = 0;

    pageTrafficLightShowing: TrafficLights[] = [];

    trafficLightsArrSize = 0;

    trafficLightsTabPage = 1;

    trafficLightAddForm = this.fb.group({
        time_green_signal: [null, [Validators.required, rangeValidator(20, 120)]],
        time_red_signal: [null, [Validators.required, rangeValidator(20, 120)]],
    });

    trafficLightEditForm = this.fb.array<
        FormGroup<{
            time_green_signal: FormControl<number>;
            time_red_signal: FormControl<number>;
        }>
    >([]);

    isFineTypeEdit = false;

    editFineTypeNumber = 0;

    pageFineTypeShowing: TypeFine[] = [];

    fineTypesArrSize = 0;

    fineTypeTabPage = 1;

    fineTypeAddForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, stringRangeValidator(40)]],
        price: [300, [Validators.required, rangeValidator(300, 20000)]],
    });

    fineTypeEditForm = this.fb.array<
        FormGroup<{
            name: FormControl<string>;
            price: FormControl<number>;
        }>
    >([]);

    constructor() {
        this.typeFuelsArrSize = this.httpService.typeFuels.length;
        this.httpService.typeFuels.forEach((typeFuel) => {
            const addedTypeFuelGroup = this.fb.nonNullable.group({
                name: [
                    typeFuel.name,
                    [Validators.required, stringRangeValidator(15)],
                ],
                price: [
                    typeFuel.price,
                    [Validators.required, rangeValidator(50, 150)],
                ],
            });
            addedTypeFuelGroup.disable();

            this.typeFuelEditForm.push(addedTypeFuelGroup);
        });

        this.fineTypesArrSize = this.httpService.fineTypes.length;
        this.httpService.fineTypes.forEach((fineType) => {
            const addedfineTypeGroup = this.fb.nonNullable.group({
                name: [
                    fineType.name,
                    [Validators.required, stringRangeValidator(40)],
                ],
                price: [
                    fineType.price,
                    [Validators.required, rangeValidator(300, 20000)],
                ],
            });
            addedfineTypeGroup.disable();

            this.fineTypeEditForm.push(addedfineTypeGroup);
        });

        this.trafficLightsArrSize = this.httpService.trafficLigths.length;
        this.httpService.trafficLigths.forEach((trafficLight) => {
            const addedTrafficLightGroup = this.fb.nonNullable.group({
                time_green_signal: [
                    trafficLight.time_green_signal,
                    [Validators.required, rangeValidator(20, 120)],
                ],
                time_red_signal: [
                    trafficLight.time_red_signal,
                    [Validators.required, rangeValidator(20, 120)],
                ],
            });
            addedTrafficLightGroup.disable();

            this.trafficLightEditForm.push(addedTrafficLightGroup);
        });

        this.coverTypesArrSize = this.httpService.coverTypes.length;
        this.httpService.coverTypes.forEach((coverType) => {
            const addedCoverTypeGroup = this.fb.nonNullable.group({
                name: [
                    coverType.name,
                    [Validators.required, stringRangeValidator(30)],
                ],
                coefficient_braking: [
                    coverType.coefficient_braking,
                    [
                        Validators.required,
                        rangeValidator(1, 2),
                        floatValidator(),
                    ],
                ],
            });
            addedCoverTypeGroup.disable();

            this.coverTypeEditForm.push(addedCoverTypeGroup);
        });

        this.streetsArrSize = this.httpService.streets.length;
        this.httpService.streets.forEach((street) => {
            const addedStreetGroup = this.fb.nonNullable.group({
                name: [
                    street.name,
                    [Validators.required, stringRangeValidator(30)],
                ],
            });
            addedStreetGroup.disable();

            this.streetEditForm.push(addedStreetGroup);
        });

        this.corruptionDegreeArrSize = this.httpService.corruptionDegrees.length;
        this.httpService.corruptionDegrees.forEach((corruptionDegree) => {
            const addedCorruptionDegreeGroup = this.fb.nonNullable.group({
                name: [
                    corruptionDegree.name,
                    [Validators.required, stringRangeValidator(30)],
                ],
                coefficient_corruption: [
                    corruptionDegree.coefficient_corruption,
                    [
                        Validators.required,
                        rangeValidator(1, 2),
                        floatValidator(),
                    ],
                ],
            });
            addedCorruptionDegreeGroup.disable();

            this.corruptionDegreeEditForm.push(addedCorruptionDegreeGroup);
        });

        this.vehiclesArrSize = this.httpService.vehicles.length;
        this.httpService.vehicles.forEach((vehicle) => {
            const addedVehicleGroup = this.fb.nonNullable.group({
                brand: [
                    vehicle.brand,
                    [Validators.required, stringRangeValidator(15)],
                ],
                typeFuel: [vehicle.type_fuel.name, Validators.required],
                consumption_fuel: [
                    vehicle.consumption_fuel,
                    [Validators.required, rangeValidator(1, 20)],
                ],
                max_speed: [
                    vehicle.max_speed,
                    [Validators.required, rangeValidator(1, 300)],
                ],
            });
            addedVehicleGroup.disable();

            this.vehicleEditForm.push(addedVehicleGroup);
        });

        this.driversArrSize = this.httpService.drivers.length;
        this.httpService.drivers.forEach((driver) => {
            const addedDriverGroup = this.fb.nonNullable.group({
                name: [
                    driver.name,
                    [Validators.required, stringRangeValidator(15)],
                ],
                surname: [
                    driver.surname,
                    [Validators.required, stringRangeValidator(20)],
                ],
                family: [
                    driver.family,
                    [Validators.required, stringRangeValidator(15)],
                ],
                infringer: [driver.infringer, Validators.required],
                vehicle: [driver.vehicle.brand, Validators.required],
            });
            addedDriverGroup.disable();

            this.driverEditForm.push(addedDriverGroup);
        });
    }

    addDriver() {
        const control = this.driverAddForm.controls;
        const driverAuto = this.httpService.vehicles.find(
            (vehicle) => vehicle.brand === control.vehicle.value
        ) as Vehicle;

        const addedDriver = {
            name: control.name.value,
            surname: control.surname.value,
            family: control.family.value,
            infringer: control.infringer.value,
            vehicle: driverAuto,
        };

        this.httpService.drivers.push(addedDriver);

        this.httpService.addMapDbValue<Driver>(addedDriver, 'driver');

        const addedDriverGroup = this.fb.nonNullable.group({
            name: ['', [Validators.required, stringRangeValidator(15)]],
            surname: ['', [Validators.required, stringRangeValidator(20)]],
            family: ['', [Validators.required, stringRangeValidator(15)]],
            infringer: [control.infringer.value, Validators.required],
            vehicle: [driverAuto.brand, Validators.required],
        });
        addedDriverGroup.disable();

        this.driverEditForm.push(addedDriverGroup);

        this.driverAddForm.reset();

        this.driversArrSize++;
    }

    //TODO с бд пока нет редактирования
    editDriver() {
        const control =
            this.driverEditForm.controls[this.editDriverNumber].controls;

        const driverAuto = this.httpService.vehicles.find(
            (vehicle) => vehicle.brand === control.vehicle.value
        ) as Vehicle;

        this.httpService.drivers[this.editDriverNumber] = {
            name: control.name.value,
            surname: control.surname.value,
            family: control.family.value,
            infringer: control.infringer.value,
            vehicle: driverAuto,
        };

        this.isDriverEdit = false;
        this.driverEditForm.controls[this.editDriverNumber].disable();
    }

    cancelEditDriver() {
        this.driverEditForm.controls[this.editDriverNumber].setValue({
            name: this.httpService.drivers[this.editDriverNumber].name,
            surname: this.httpService.drivers[this.editDriverNumber].surname,
            family: this.httpService.drivers[this.editDriverNumber].family,
            infringer: this.httpService.drivers[this.editDriverNumber].infringer,
            vehicle: this.httpService.drivers[this.editDriverNumber].vehicle.brand,
        });

        this.isDriverEdit = false;
        this.driverEditForm.controls[this.editDriverNumber].disable();
    }

    //TODO в бд пока нет
    driverDelete(index: number) {
        this.httpService.drivers.splice(index, 1);
        this.driverEditForm.controls.splice(index, 1);
        this.driversArrSize--;
    }

    addVehicle() {
        const control = this.vehicleAddForm.controls;
        const vehicleTypeFuel = this.httpService.typeFuels.find(
            (typeFuel) => typeFuel.name === control.typeFuel.value
        ) as TypeFuel;

        const addedVehicle = {
            brand: control.brand.value,
            type_fuel: vehicleTypeFuel,
            consumption_fuel: control.consumption_fuel.value,
            max_speed: control.max_speed.value,
        };

        this.httpService.vehicles.push(addedVehicle);
        this.httpService.addMapDbValue<Vehicle>(addedVehicle, 'car')

        const addedVehicleGroup = this.fb.nonNullable.group({
            brand: [
                control.brand.value,
                [Validators.required, stringRangeValidator(15)],
            ],
            typeFuel: [control.typeFuel.value, Validators.required],
            consumption_fuel: [
                control.consumption_fuel.value,
                [Validators.required, rangeValidator(1, 20)],
            ],
            max_speed: [
                control.max_speed.value,
                [Validators.required, rangeValidator(1, 300)],
            ],
        });
        addedVehicleGroup.disable();

        this.vehicleEditForm.push(addedVehicleGroup);

        this.vehicleAddForm.reset();

        this.vehiclesArrSize++;
    }

    //TODO v bd net
    editVehicle() {
        const control =
            this.vehicleEditForm.controls[this.editVehicleNumber].controls;

        const vehicleTypeFuel = this.httpService.typeFuels.find(
            (typeFuel) => typeFuel.name === control.typeFuel.value
        ) as TypeFuel;

        this.httpService.vehicles[this.editVehicleNumber] = {
            brand: control.brand.value,
            type_fuel: vehicleTypeFuel,
            consumption_fuel: control.consumption_fuel.value,
            max_speed: control.max_speed.value,
        };

        this.isVehicleEdit = false;
        this.vehicleEditForm.controls[this.editVehicleNumber].disable();
    }

    cancelEditVehicle() {
        this.vehicleEditForm.controls[this.editVehicleNumber].setValue({
            brand: this.httpService.vehicles[this.editVehicleNumber].brand,
            typeFuel: this.httpService.vehicles[this.editVehicleNumber].type_fuel.name,
            consumption_fuel:
                this.httpService.vehicles[this.editVehicleNumber].consumption_fuel,
            max_speed: this.httpService.vehicles[this.editVehicleNumber].max_speed,
        });

        this.isVehicleEdit = false;
        this.vehicleEditForm.controls[this.editVehicleNumber].disable();
    }

    //TODO v bd net
    vehicleDelete(index: number) {
        this.httpService.vehicles.splice(index, 1);
        this.vehicleEditForm.controls.splice(index, 1);
        this.vehiclesArrSize--;
    }

    addCorruptionDegree() {
        const control = this.corruptionDegreeAddForm.controls;

        const addedCorruptionDegree = {
            name: control.name.value,
            coefficient_corruption: control.coefficient_corruption.value,
        };

        this.httpService.corruptionDegrees.push(addedCorruptionDegree);
        this.httpService.addMapDbValue<DegreeCorruption>(addedCorruptionDegree, 'corruption')

        const addedCorruptionDegreeGroup = this.fb.nonNullable.group({
            name: [
                control.name.value,
                [Validators.required, stringRangeValidator(30)],
            ],
            coefficient_corruption: [
                control.coefficient_corruption.value,
                [Validators.required, rangeValidator(1, 2), floatValidator()],
            ],
        });
        addedCorruptionDegreeGroup.disable();

        this.corruptionDegreeEditForm.push(addedCorruptionDegreeGroup);

        this.corruptionDegreeAddForm.reset();

        this.corruptionDegreeArrSize++;
    }

    //TODO v bd net
    editCorruptionDegree() {
        const control =
            this.corruptionDegreeEditForm.controls[
                this.editCorruptionDegreeNumber
            ].controls;

        this.httpService.corruptionDegrees[this.editCorruptionDegreeNumber] = {
            name: control.name.value,
            coefficient_corruption: control.coefficient_corruption.value,
        };

        this.isCorruptionDegreeEdit = false;
        this.corruptionDegreeEditForm.controls[
            this.editCorruptionDegreeNumber
        ].disable();
    }

    cancelEditCorruptionDegree() {
        this.corruptionDegreeEditForm.controls[
            this.editCorruptionDegreeNumber
        ].setValue({
            name: this.httpService.corruptionDegrees[this.editCorruptionDegreeNumber].name,
            coefficient_corruption:
                this.httpService.corruptionDegrees[this.editCorruptionDegreeNumber]
                    .coefficient_corruption,
        });

        this.isCorruptionDegreeEdit = false;
        this.corruptionDegreeEditForm.controls[
            this.editCorruptionDegreeNumber
        ].disable();
    }

    //TODO v bd net
    corruptionDegreeDelete(index: number) {
        this.httpService.corruptionDegrees.splice(index, 1);
        this.corruptionDegreeEditForm.controls.splice(index, 1);
        this.corruptionDegreeArrSize--;
    }

    addTypeFuel() {
        const control = this.typeFuelAddForm.controls;

        const addedTypeFuel = {
            name: control.name.value,
            price: control.price.value,
        };

        this.httpService.typeFuels.push(addedTypeFuel);
        this.httpService.addMapDbValue<FuelType>(addedTypeFuel,'fuel');

        const addedTypeFuelGroup = this.fb.nonNullable.group({
            name: [
                control.name.value,
                [Validators.required, stringRangeValidator(15)],
            ],
            price: [
                control.price.value,
                [Validators.required, rangeValidator(50, 150)],
            ],
        });
        addedTypeFuelGroup.disable();

        this.typeFuelEditForm.push(addedTypeFuelGroup);

        this.typeFuelAddForm.reset();

        this.typeFuelsArrSize++;
    }

    //TODO
    editTypeFuel() {
        const control =
            this.typeFuelEditForm.controls[this.editTypeFuelNumber].controls;

        this.httpService.typeFuels[this.editTypeFuelNumber] = {
            name: control.name.value,
            price: control.price.value,
        };

        this.isTypeFuelEdit = false;
        this.typeFuelEditForm.controls[this.editTypeFuelNumber].disable();
    }

    cancelEditTypeFuel() {
        this.typeFuelEditForm.controls[this.editTypeFuelNumber].setValue({
            name: this.httpService.typeFuels[this.editTypeFuelNumber].name,
            price: this.httpService.typeFuels[this.editTypeFuelNumber].price,
        });

        this.isTypeFuelEdit = false;
        this.typeFuelEditForm.controls[this.editTypeFuelNumber].disable();
    }

    //TODO
    typeFuelDelete(index: number) {
        this.httpService.typeFuels.splice(index, 1);
        this.typeFuelEditForm.controls.splice(index, 1);
        this.typeFuelsArrSize--;
    }

    addStreet() {
        const control = this.streetAddForm.controls;

        const addedStreet = {
            name: control.name.value,
        };

        this.httpService.streets.push(addedStreet);
        this.httpService.addMapDbValue<Street>(addedStreet, 'street')

        const addedStreetGroup = this.fb.nonNullable.group({
            name: [
                control.name.value,
                [Validators.required, stringRangeValidator(30)],
            ],
        });
        addedStreetGroup.disable();

        this.streetEditForm.push(addedStreetGroup);

        this.streetAddForm.reset();

        this.streetsArrSize++;
    }

    //TODO
    editStreet() {
        const control =
            this.streetEditForm.controls[this.editStreetNumber].controls;

        this.httpService.streets[this.editStreetNumber] = {
            name: control.name.value,
        };

        this.isStreetEdit = false;
        this.streetEditForm.controls[this.editStreetNumber].disable();
    }

    cancelEditStreet() {
        this.streetEditForm.controls[this.editStreetNumber].setValue({
            name: this.httpService.streets[this.editStreetNumber].name,
        });

        this.isStreetEdit = false;
        this.streetEditForm.controls[this.editStreetNumber].disable();
    }

    //TODO
    streetDelete(index: number) {
        this.httpService.streets.splice(index, 1);
        this.streetEditForm.controls.splice(index, 1);
        this.streetsArrSize--;
    }

    addCoverType() {
        const control = this.coverTypeAddForm.controls;

        const addedCoverType = {
            name: control.name.value,
            coefficient_braking: control.coefficient_braking.value,
        };

        this.httpService.coverTypes.push(addedCoverType);
        this.httpService.addMapDbValue<TypeCover>(addedCoverType, 'coverage');

        const addedCoverTypeGroup = this.fb.nonNullable.group({
            name: [
                control.name.value,
                [Validators.required, stringRangeValidator(30)],
            ],
            coefficient_braking: [
                control.coefficient_braking.value,
                [Validators.required, rangeValidator(1, 2), floatValidator()],
            ],
        });
        addedCoverTypeGroup.disable();

        this.coverTypeEditForm.push(addedCoverTypeGroup);

        this.coverTypeAddForm.reset();

        this.coverTypesArrSize++;
        console.log(this.httpService.coverTypes);
    }

    //TODO
    editCoverType() {
        const control =
            this.coverTypeEditForm.controls[this.editCoverTypeNumber].controls;

        this.httpService.coverTypes[this.editCoverTypeNumber] = {
            name: control.name.value,
            coefficient_braking: control.coefficient_braking.value,
        };

        this.isCoverTypeEdit = false;
        this.coverTypeEditForm.controls[this.editCoverTypeNumber].disable();
    }

    cancelEditCoverType() {
        this.coverTypeEditForm.controls[this.editCoverTypeNumber].setValue({
            name: this.httpService.coverTypes[this.editCoverTypeNumber].name,
            coefficient_braking:
                this.httpService.coverTypes[this.editCoverTypeNumber].coefficient_braking,
        });

        this.isCoverTypeEdit = false;
        this.coverTypeEditForm.controls[this.editCoverTypeNumber].disable();
    }

    //TODO
    coverTypeDelete(index: number) {
        this.httpService.coverTypes.splice(index, 1);
        this.coverTypeEditForm.controls.splice(index, 1);
        this.coverTypesArrSize--;
    }

    addTrafficLight() {
        const control = this.trafficLightAddForm.controls;

        const addedTrafficLight = {
            time_green_signal: control.time_green_signal.value as unknown as number,
            time_red_signal: control.time_red_signal.value as unknown as number,
        };

        this.httpService.trafficLigths.push(addedTrafficLight);
        this.httpService.addMapDbValue<TrafficLights>(addedTrafficLight, 'traffic-light')

        const addedTrafficLightGroup = this.fb.nonNullable.group({
            time_green_signal: [
                control.time_green_signal.value as unknown as number,
                [Validators.required, rangeValidator(20, 120)],
            ],
            time_red_signal: [
                control.time_red_signal.value as unknown as number,
                [Validators.required, rangeValidator(20, 120)],
            ],
        });
        addedTrafficLightGroup.disable();

        this.trafficLightEditForm.push(addedTrafficLightGroup);

        this.trafficLightAddForm.reset();

        this.trafficLightsArrSize++;
    }

    //TODO
    editTrafficLights() {
        const control =
            this.trafficLightEditForm.controls[this.editTrafficLightNumber]
                .controls;

        this.httpService.trafficLigths[this.editTrafficLightNumber] = {
            time_green_signal: control.time_green_signal.value,
            time_red_signal: control.time_red_signal.value,
        };

        this.isTrafficLightEdit = false;
        this.trafficLightEditForm.controls[
            this.editTrafficLightNumber
        ].disable();
    }

    cancelEditTrafficLights() {
        this.trafficLightEditForm.controls[
            this.editTrafficLightNumber
        ].setValue({
            time_green_signal:
                this.httpService.trafficLigths[this.editTrafficLightNumber]
                    .time_green_signal,
            time_red_signal:
                this.httpService.trafficLigths[this.editTrafficLightNumber].time_red_signal,
        });

        this.isTrafficLightEdit = false;
        this.trafficLightEditForm.controls[
            this.editTrafficLightNumber
        ].disable();
    }

    //TODO
    trafficLightDelete(index: number) {
        this.httpService.trafficLigths.splice(index, 1);
        this.trafficLightEditForm.controls.splice(index, 1);
        this.trafficLightsArrSize--;
    }

    addFineType() {
        const control = this.fineTypeAddForm.controls;

        const addedFineType = {
            name: control.name.value,
            price: control.price.value,
        };

        this.httpService.fineTypes.push(addedFineType);
        this.httpService.addMapDbValue<TypeFine>(addedFineType, 'fine');

        const addedFineTypeGroup = this.fb.nonNullable.group({
            name: [
                control.name.value,
                [Validators.required, stringRangeValidator(40)],
            ],
            price: [
                control.price.value,
                [Validators.required, rangeValidator(300, 20000)],
            ],
        });
        addedFineTypeGroup.disable();

        this.fineTypeEditForm.push(addedFineTypeGroup);

        this.fineTypeAddForm.reset();

        this.fineTypesArrSize++;
    }

    //TODO
    editFineTypes() {
        const control =
            this.fineTypeEditForm.controls[this.editFineTypeNumber].controls;

        this.httpService.fineTypes[this.editFineTypeNumber] = {
            name: control.name.value,
            price: control.price.value,
        };

        this.isFineTypeEdit = false;
        this.fineTypeEditForm.controls[this.editFineTypeNumber].disable();
    }

    cancelEditFineTypes() {
        this.fineTypeEditForm.controls[this.editFineTypeNumber].setValue({
            name: this.httpService.fineTypes[this.editFineTypeNumber].name,
            price: this.httpService.fineTypes[this.editFineTypeNumber].price,
        });

        this.isFineTypeEdit = false;
        this.fineTypeEditForm.controls[this.editFineTypeNumber].disable();
    }

    //TODO
    fineTypeDelete(index: number) {
        this.httpService.fineTypes.splice(index, 1);
        this.fineTypeEditForm.controls.splice(index, 1);
        this.fineTypesArrSize--;
    }

    isRequiredError(form: FormGroup) {
        let hasErrors = false;

        Object.keys(form.controls).forEach((key) => {
            const control = form.get(key);

            if (control?.dirty && control.hasError('required')) {
                hasErrors = true;
                return;
            }
        });

        return hasErrors;
    }

    driverDuplicateValidation() {
        let hasDuplicate = false;
        this.httpService.drivers.forEach((driver) => {
            const control = this.driverAddForm.controls;
            if (
                driver.family === control.family.value &&
                driver.surname === control.surname.value &&
                driver.name === control.name.value
            ) {
                hasDuplicate = true;
                return;
            }
        });

        return hasDuplicate;
    }

    vehicleDuplicateValidation() {
        let hasDuplicate = false;
        this.httpService.vehicles.forEach((vehicle) => {
            const control = this.vehicleAddForm.controls;
            if (vehicle.brand === control.brand.value) {
                hasDuplicate = true;
                return;
            }
        });

        return hasDuplicate;
    }

    typeFuelDuplicateValidation() {
        let hasDuplicate = false;
        this.httpService.typeFuels.forEach((typeFuel) => {
            const control = this.typeFuelAddForm.controls;
            if (typeFuel.name === control.name.value) {
                hasDuplicate = true;
                return;
            }
        });

        return hasDuplicate;
    }

    corruptionDegreeDuplicateValidation() {
        let hasDuplicate = false;
        this.httpService.corruptionDegrees.forEach((corruptionDegree) => {
            const control = this.corruptionDegreeAddForm.controls;
            if (corruptionDegree.name === control.name.value) {
                hasDuplicate = true;
                return;
            }
        });

        return hasDuplicate;
    }

    streetDuplicateValidation() {
        let hasDuplicate = false;
        this.httpService.streets.forEach((street) => {
            const control = this.streetAddForm.controls;
            if (street.name === control.name.value) {
                hasDuplicate = true;
                return;
            }
        });

        return hasDuplicate;
    }

    coverTypeDuplicateValidation() {
        let hasDuplicate = false;
        this.httpService.coverTypes.forEach((coverType) => {
            const control = this.coverTypeAddForm.controls;
            if (coverType.name === control.name.value) {
                hasDuplicate = true;
                return;
            }
        });

        return hasDuplicate;
    }

    trafficLightDuplicateValidation() {
        let hasDuplicate = false;
        this.httpService.trafficLigths.forEach((trafficLight) => {
            const control = this.trafficLightAddForm.controls;
            if (
                trafficLight.time_green_signal ===
                    control.time_green_signal.value &&
                trafficLight.time_red_signal === control.time_red_signal.value
            ) {
                hasDuplicate = true;
                return;
            }
        });

        return hasDuplicate;
    }

    fineTypeDuplicateValidation() {
        let hasDuplicate = false;
        this.httpService.fineTypes.forEach((fineType) => {
            const control = this.fineTypeAddForm.controls;
            if (fineType.name === control.name.value) {
                hasDuplicate = true;
                return;
            }
        });

        return hasDuplicate;
    }

    allowOnlyDigits(event: KeyboardEvent): void {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
    }
}

function floatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        const isValid = /^[0-9]+(\.[0-9]+)?$/.test(value);

        return isValid ? null : { floatOnly: true };
    };
}

function stringRangeValidator(maxValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value as string;

        if (value !== '' && !value) {
            return null;
        }

        if (value.length > maxValue) {
            return { stringRange: true };
        }

        return null;
    };
}

function rangeValidator(minValue: number, maxValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (value !== 0 && !value) {
            return null;
        }

        if (value < minValue || value > maxValue) {
            return { range: true };
        }

        return null;
    };
}
