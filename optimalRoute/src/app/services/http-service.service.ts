import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private apiUrl = 'https://localhost:7249/api/v1/HttpOptimalRoute'; // Замените на ваш API-адрес

    constructor(private http: HttpClient) {}

    addTypeFuel(newFuel: { name: string; price: number }): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/fuel`, newFuel);
    }

    getTypeFuel(): Observable<any> {
        return this.http.get(`${this.apiUrl}/admin/fuel`);
    }
}
