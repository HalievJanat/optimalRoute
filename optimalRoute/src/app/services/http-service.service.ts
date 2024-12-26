import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Driver, TypeFuel, Vehicle } from '../models/driver.model';
import { TypeFine } from '../models/fine-type.model';
import { DegreeCorruption } from '../models/police-post.model';
import { Street } from '../models/street.model';
import { TypeCover } from '../models/cover-type.model';
import { TrafficLights } from '../models/traffic-light.model';
import { Observable } from 'rxjs';
import { UDS } from '../models/UDS.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private apiUrl = 'https://localhost:7249/api/v1/HttpOptimalRoute';

    constructor(private http: HttpClient, private toastr: ToastrService) {}

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

     //TODO NE POMNU SSILKI
    getUDS(): Observable<UDS> {
        return this.http.get<UDS>(`${this.apiUrl}/admin/.....`);
    } 

    //TODO NE POMNU SSILKI
    getUDSList(): Observable<UDS[]> {
        return this.http.get<UDS[]>(`${this.apiUrl}/admin/.....`);
    } 

    addMapDbValue<T>(value: T, url: string) {
        let successful = true;
        this.http.post(`${this.apiUrl}/admin/${url}`, value).subscribe({
            error: (_) => {
                successful = false;
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            }
        });
        return successful;
    }

    updateMapDbValue<T> (value: T, url: string) {
        this.http.patch(`${this.apiUrl}/admin/${url}`, value).subscribe();
    }

    //TODO HUINYA KAKAYA-TO
    // deleteMapDbValue<T> (value: T, url: string) {
    //     this.http.delete(url, value);
    // }
}
