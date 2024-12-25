export interface TypeFuel {
    id_type_fuel: number;
    name: string;
    price: number;
}

export interface Vehicle {
    id_vehicle: number;
    brand: string;
    type_fuel: TypeFuel;
    consumption_fuel: number;
    max_speed: number;
}

export interface Driver {
    id_driver: number;
    name: string;
    surname: string;
    family: string;
    infringer: boolean;
    vehicle: Vehicle;
}
