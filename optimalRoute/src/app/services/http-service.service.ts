import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Driver, TypeFuel, Vehicle } from '../models/driver.model';
import { TypeFine } from '../models/fine-type.model';
import { DegreeCorruption } from '../models/police-post.model';
import { Street } from '../models/street.model';
import { TypeCover } from '../models/cover-type.model';
import { TrafficLights } from '../models/traffic-light.model';
import { Observable } from 'rxjs';

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

	constructor(private http: HttpClient) {
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
		this.http.get<T[]>(`${this.apiUrl}/admin/${url}`).subscribe((value) => {
			storage = value;
		});
	}

	getDrivers(): Observable<Driver[]> {
        return this.http.get<Driver[]>(`${this.apiUrl}/admin/driver`);
    }

	getVehicles(): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(`${this.apiUrl}/admin/car`);
    }

	getTypeFuels(): Observable<TypeFuel[]> {
        return this.http.get<TypeFuel[]>(`${this.apiUrl}/admin/fuel`);
    }

	getDegreeCorruptions(): Observable<DegreeCorruption[]> {
        return this.http.get<DegreeCorruption[]>(`${this.apiUrl}/admin/corruption`);
    }

	getStreets(): Observable<Street[]> {
        return this.http.get<Street[]>(`${this.apiUrl}/admin/street`);
    }

	getTypeCovers(): Observable<TypeCover[]> {
        return this.http.get<TypeCover[]>(`${this.apiUrl}/admin/coverage`);
    }

	getTrafficLights(): Observable<TrafficLights[]> {
        return this.http.get<TrafficLights[]>(`${this.apiUrl}/admin/traffic-light`);
    }

	getTypeFines(): Observable<TypeFine[]> {
        return this.http.get<TypeFine[]>(`${this.apiUrl}/admin/fine`);
    }

	addMapDbValue<T>(value: T, url: string) {
        this.http.post(`${this.apiUrl}/admin/${url}`, value).subscribe();
    }
}
