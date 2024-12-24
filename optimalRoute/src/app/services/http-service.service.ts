import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Driver, TypeFuel, Vehicle } from '../models/driver.model';
import { TypeFine } from '../models/fine-type.model';
import { DegreeCorruption } from '../models/police-post.model';
import { Street } from '../models/street.model';
import { TypeCover } from '../models/cover-type.model';
import { TrafficLights } from '../models/traffic-light.model';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private apiUrl = 'https://localhost:7249/api/v1/HttpOptimalRoute'; 

	drivers: Driver[] = [];
	vehicles: Vehicle[] = [];
	fineTypes: TypeFine[] = [];
	corruptionDegrees: DegreeCorruption[] = [];
	typeFuels: TypeFuel[] = [];
	streets: Street[] = [];
	coverTypes: TypeCover[] = [];
	trafficLigths: TrafficLights[] = [];

	constructor(private httpClient: HttpClient) {
		console.log('ya servis');
		this.getMapDbValue<Driver>(this.drivers, 'driver');
		this.getMapDbValue<Vehicle>(this.vehicles, 'car');
		this.getMapDbValue<TypeFine>(this.fineTypes, 'fine');
		this.getMapDbValue<DegreeCorruption>(this.corruptionDegrees, 'corruption');
		this.getMapDbValue<TypeFuel>(this.typeFuels, 'fuel');
		this.getMapDbValue<Street>(this.streets, 'street');
		this.getMapDbValue<TypeCover>(this.coverTypes, 'coverage');
		this.getMapDbValue<TrafficLights>(this.trafficLigths, 'traffic-light');
	}

	private getMapDbValue<T>(storage: T[], url: string) {
		this.httpClient.get<T[]>(`${this.apiUrl}/admin/${url}`).subscribe((value) => {
			storage = value;
		});
	}

	addMapDbValue<T>(value: T, url: string) {
        this.httpClient.post(`${this.apiUrl}/admin/${url}`, value).subscribe();
    }
}
