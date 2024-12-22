import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeFuel } from '../models/driver.model';
import { TypeFine } from '../models/fine-type.model';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private apiUrl = 'https://localhost:7249/api/v1/HttpOptimalRoute'; // Замените на ваш API-адрес

    constructor(private http: HttpClient) {}

    addTypeFuel(newFuel: { name: string; price: number }): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/fuel`, newFuel);
    }

    getAdminDbMapData<T>(dataUrl: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/admin/${dataUrl}`);
    }
}
