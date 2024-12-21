import { FuelType } from './fuel-type.model';

export interface Vehicle {
    brand: string;
    typeFuel: FuelType;
    consumptionFuel: number;
    maxSpeed: number;
}
