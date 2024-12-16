
export namespace ClassOptimalRoute {
    export class Crossroad {
        private x: number;
        private y: number;
        private trafficLights: TrafficLights | null;

        public set X(X: number) {
            this.x = X;
        }

        public get X(): number {
            return this.x;
        }

        public set Y(Y: number) {
            this.y = Y;
        }

        public get Y(): number {
            return this.y;
        }

        public set TrafficLights(trafficLights: TrafficLights | null) {
            this.trafficLights = trafficLights;
        }

        public get TrafficLights(): TrafficLights | null {
            return this.trafficLights;
        }


        constructor() {
            this.x = 0;
            this.y = 0;
            this.trafficLights = null;
        }
    }

    export class TrafficLights {
        private time_green_signal: number;
        private time_red_signal: number;

        public set TimeGreenSignal(timeGreenSignal: number) {
            this.time_green_signal = timeGreenSignal;
        }

        public get TimeGreenSignal(): number {
            return this.time_green_signal;
        }

        public set TimeRedSignal(timeRedSignal: number) {
            this.time_red_signal = timeRedSignal;
        }

        public get TimeRedSignal(): number {
            return this.time_red_signal;
        }

        constructor() {
            this.time_green_signal = 20;
            this.time_red_signal = 20;
        }
    }

    export class Road {
        private crossroad_1: number;
        private crossroad_2: number;
        private street: Street;
        private traffic_signs: TrafficSigns | null;
        private typeCover: TypeCover;
        private police_post: PolicePost | null;
        private length: number;
        private direction: number;

        public set Crossroad1(crossroad_1: number) {
            this.crossroad_1 = crossroad_1;
        }

        public get Crossroad1(): number {
            return this.crossroad_1;
        }

        public set Crossroad2(crossroad_2: number) {
            this.crossroad_2 = crossroad_2;
        }

        public get Crossroad2(): number {
            return this.crossroad_2;
        }

        public get Street(): Street {
            return this.street;
        }

        public set Street(value: Street) {
            this.street = value;
        }

        public get TrafficSigns(): TrafficSigns | null {
            return this.traffic_signs;
        }

        public set TrafficSigns(value: TrafficSigns | null) {
            this.traffic_signs = value;
        }

        public get TypeCover(): TypeCover {
            return this.typeCover;
        }

        public set TypeCover(value: TypeCover) {
            this.typeCover = value;
        }

        public get PolicePost(): PolicePost | null {
            return this.police_post;
        }

        public set PolicePost(value: PolicePost | null) {
            this.police_post = value;
        }

        public set Length(value: number) {
            this.length = value;
        }

        public get Length(): number {
            return this.length;
        }

        public set Direction(value: number) {
            this.direction = value;
        }

        public get Direction(): number {
            return this.direction;
        }

        constructor() {
            this.crossroad_1 = 0;
            this.crossroad_2 = 0;
            this.street = new Street();
            this.traffic_signs = null;
            this.typeCover = new TypeCover();
            this.police_post = null;
            this.length = 1;
            this.direction = 0;
        }
    }

    export class DegreeCorruption {
        private name: string;
        private coefficient_corruption: number;

        public get Name(): string {
            return this.name;
        }
        public set Name(value: string) {
            this.name = value;
        }

        public get CoefficientCorruption(): number {
            return this.coefficient_corruption;
        }
        public set CoefficientCorruption(value: number) {
            this.coefficient_corruption = value;
        }
        
        constructor() {
            this.name = "";
            this.coefficient_corruption = 0;
        }
    }

    export class PolicePost {
        private corruption: DegreeCorruption;
        
        public get Corruption(): DegreeCorruption {
            return this.corruption;
        }
        public set Corruption(value: DegreeCorruption) {
            this.corruption = value;
        }

        constructor() {
            this.corruption = new DegreeCorruption;
        }
    }

    export class Street {
        private name: string;

        public get Name(): string {
            return this.name;
        }
        public set Name(value: string) {
            this.name = value;
        }

        constructor() {
            this.name = "";
        }
    }

    export class TrafficSigns { //30,40,50
        private speed: number;

        public get Speed(): number {
            return this.speed;
        }
        public set Speed(value: number) {
            this.speed = value;
        }

        constructor() {
            this.speed = 30;
        }
    }

    export class TypeCover {
        private name: string;
        private coefficient_braking: number;

        public get Name(): string {
            return this.name;
        }
        public set Name(value: string) {
            this.name = value;
        }

        public get CoefficientBraking(): number {
            return this.coefficient_braking;
        }
        public set CoefficientBraking(value: number) {
            this.coefficient_braking = value;
        }
        
        constructor() {
            this.name = "";
            this.coefficient_braking = 1;
        }
    }

    export class TypeFine {
        private name: string;
        private price: number;

        public get Name(): string {
            return this.name;
        }
        public set Name(value: string) {
            this.name = value;
        }

        public get Price(): number {
            return this.price;
        }
        public set Price(value: number) {
            this.price = value;
        }
        
        constructor() {
            this.name = "";
            this.price = 300;
        }
    }

    export class Driver {
        private full_name: string;
        private infringer: boolean;
        private vehicle: Vehicle;

        public set FullName(value: string) {
            this.full_name = value;
        }

        public get FullName(): string  {
            return this.full_name;
        }

        public set Infringer(value: boolean) {
            this.infringer = value;
        }

        public get Infringer(): boolean {
            return this.infringer;
        }

        public set Vehicle(value: Vehicle) {
            this.vehicle = value;
        }

        public get Vehicle(): Vehicle {
            return this.vehicle;
        }

        constructor() {
            this.full_name = "";
            this.infringer = false;
            this.vehicle = new Vehicle();
        }
    }

    export class TypeFuel {
        private name: string;
        private price: number;

        public get Name(): string {
            return this.name;
        }
        public set Name(value: string) {
            this.name = value;
        }

        public get Price(): number {
            return this.price;
        }
        public set Price(value: number) {
            this.price = value;
        }
        
        constructor() {
            this.name = "";
            this.price = 50;
        }
    }

    export class Vehicle {
        private brand: string;
        private typeFuel: TypeFuel;
        private consumption_fuel: number;
        private max_speed: number;

        public get Brand(): string {
            return this.brand;
        }

        public set Brand(value: string) {
            this.brand = value;
        }

        public get TypeFuel(): TypeFuel {
            return this.typeFuel;
        }

        public set TypeFuel(value: TypeFuel) {
            this.typeFuel = value;
        }

        public get ConsumptionFuel(): number {
            return this.consumption_fuel;
        }

        public set ConsumptionFuel(value: number) {
            this.consumption_fuel = value;
        }

        public get MaxSpeed(): number {
            return this.max_speed;
        }
        public set MaxSpeed(value: number) {
            this.max_speed = value;
        }


        constructor() {
            this.brand = "";
            this.typeFuel = new TypeFuel();
            this.consumption_fuel = 0;
            this.max_speed = 0;
        }
    }

    export class Route {
        private start_crossroad: number;
        private end_crossroad: number;
        private driver: Driver;
        private criteria_searche: string;
        private crossroads: number[];
        private type_fines: TypeFine[];
        

        public set StartCrossroad (value: number) {
            this.start_crossroad = value;
        }

        public get StartCrossroad(): number {
            return this.start_crossroad;
        }

        public set EndCrossroad (value: number) {
            this.end_crossroad = value;
        }

        public get EndCrossroad(): number {
            return this.end_crossroad;
        }

        public get Driver(): Driver {
            return this.driver;
        }

        public set Driver(value: Driver) {
            this.driver = value;
        }

        public get CriteriaSearche(): string {
            return this.criteria_searche;
        }

        public set CriteriaSearche(value: string) {
            this.criteria_searche = value;
        }

        public get Crossroads(): number[] {
            return this.crossroads;
        }

        public set Crossroads(value: number[]) {
            this.crossroads = value;
        }

        public get TypeFines(): TypeFine[] {
            return this.type_fines;
        }
        public set TypeFines(value: TypeFine[]) {
            this.type_fines = value;
        }

        constructor() {
            this.start_crossroad = 0;
            this.end_crossroad = 0;
            this.driver = new Driver;
            this.criteria_searche = "";
            this.crossroads = [];
            this.type_fines = [];
        }
    }
}