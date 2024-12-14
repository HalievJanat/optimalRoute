import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import {
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Driver, Vehicle } from '../../../models/driver.model';

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

    //TODO
    vehicles: Vehicle[] = [
        {
            brand: 'Audi',
            typeFuel: {
                name: '',
                price: 0,
            },
            consumptionFuel: 0,
            maxSpeed: 0,
        },
        {
            brand: 'BMW',
            typeFuel: {
                name: '',
                price: 0,
            },
            consumptionFuel: 0,
            maxSpeed: 0,
        },
        {
            brand: 'Buhanka',
            typeFuel: {
                name: '',
                price: 0,
            },
            consumptionFuel: 0,
            maxSpeed: 0,
        },
    ];

    //TODO ПОКА ЧТО ДАННЫЕ ЗАМОКАНЫ
    drivers: Driver[] = [
        {
            name: 'Никита',
            surname: 'Юрьеивч',
            family: 'Шатилов',
            infringer: false,
            vehicle: {
                brand: 'audi',
                typeFuel: {
                    name: 'Топливо',
                    price: 55,
                },
                consumptionFuel: 12,
                maxSpeed: 300,
            },
        },
        {
            name: 'Жанат',
            surname: 'Тлекешевич',
            family: 'Халиев',
            infringer: true,
            vehicle: {
                brand: 'Девятка',
                typeFuel: {
                    name: 'Топливо',
                    price: 55,
                },
                consumptionFuel: 12,
                maxSpeed: 10,
            },
        },
        {
            name: 'Глеб',
            surname: 'Алексеевич',
            family: 'Уваров',
            infringer: true,
            vehicle: {
                brand: 'Буханка',
                typeFuel: {
                    name: 'Топливо',
                    price: 55,
                },
                consumptionFuel: 12,
                maxSpeed: 10000,
            },
        },
        {
            name: 'Мария',
            surname: 'Вадимовна',
            family: 'Петренко',
            infringer: true,
            vehicle: {
                brand: 'Нет машины',
                typeFuel: {
                    name: 'Топливо',
                    price: 55,
                },
                consumptionFuel: 12,
                maxSpeed: 0,
            },
        },
        {
            name: '',
            surname: '',
            family: '',
            infringer: true,
            vehicle: {
                brand: 'Нет машины',
                typeFuel: {
                    name: 'Топливо',
                    price: 55,
                },
                consumptionFuel: 12,
                maxSpeed: 0,
            },
        },
        {
            name: '',
            surname: '',
            family: '',
            infringer: true,
            vehicle: {
                brand: 'Нет машины',
                typeFuel: {
                    name: 'Топливо',
                    price: 55,
                },
                consumptionFuel: 12,
                maxSpeed: 0,
            },
        },
    ];

    pageDriversShowing: Driver[] = [];

    driversArrSize = 0;

    driverTabPage = 1;

    driverAddForm = this.fb.nonNullable.group({
        name: ['', Validators.required],
        surname: ['', Validators.required],
        family: ['', Validators.required],
        infringer: false,
        vehicle: ['', Validators.required],
    });

    constructor() {
        this.driversArrSize = this.drivers.length;
        this.refreshDrivers();
    }

    addDriver() {}

    isFormInvalid(form: FormGroup) {
        let hasErrors = false;

        Object.keys(form.controls).forEach((key) => {
            const control = form.get(key);

            if (control?.dirty && control.invalid) {
                hasErrors = true;
                return;
            }
        });

        return hasErrors;
    }

    refreshDrivers() {
        this.pageDriversShowing = this.drivers
            .map((driver, i) => ({
                id: i + 1,
                ...driver,
            }))
            .slice(
                (this.driverTabPage - 1) * 4,
                (this.driverTabPage - 1) * 4 + 4
            );
    }
}
