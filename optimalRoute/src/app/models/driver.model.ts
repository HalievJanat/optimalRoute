export interface FuelType {
    name: string;
    price: number;
}

export interface Vehicle {
    brand: string;
    typeFuel: FuelType;
    consumptionFuel: number;
    maxSpeed: number;
}

export interface Driver {
    name: string;
    surname: string;
    family: string;
    infringer: boolean;
    vehicle: Vehicle;
}
