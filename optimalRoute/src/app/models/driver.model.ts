export interface FuelType {
    name: string;
    price: number;
}

export interface Vehicle {
    brand: string;
    typeFuel: FuelType;
    consumption_fuel: number;
    max_speed: number;
}

export interface Driver {
    name: string;
    surname: string;
    family: string;
    infringer: boolean;
    vehicle: Vehicle;
}
