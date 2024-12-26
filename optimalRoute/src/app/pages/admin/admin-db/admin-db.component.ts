import { Component } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { DriverFormComponent } from './forms/driver-form/driver-form.component';
import { VehicleFormComponent } from './forms/vehicle-form/vehicle-form.component';
import { CorruptionFormComponent } from './forms/corruption-form/corruption-form.component';
import { FuelFormComponent } from './forms/fuel-form/fuel-form.component';
import { StreetFormComponent } from './forms/street-form/street-form.component';
import { CoverFormComponent } from './forms/cover-form/cover-form.component';
import { TrafficLightsFormComponent } from './forms/traffic-lights-form/traffic-lights-form.component';
import { FineFormComponent } from './forms/fine-form/fine-form.component';

@Component({
    selector: 'app-admin-db',
    standalone: true,
    imports: [
        HeaderComponent,
        NgbNavModule,
        NgbTypeaheadModule,
        DriverFormComponent,
        VehicleFormComponent,
        CorruptionFormComponent,
        FuelFormComponent,
        StreetFormComponent,
        CoverFormComponent,
        TrafficLightsFormComponent,
        FineFormComponent,
    ],
    templateUrl: './admin-db.component.html',
    styleUrl: './admin-db.component.scss',
})
export class AdminDbComponent {
    activeRightElement = 1;

    isFineTypeEdit = false; //чтобы прятать кнопку добавить у штрафа
}
