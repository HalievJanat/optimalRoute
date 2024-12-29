import { TrafficLights } from './traffic-light.model';
import { Street } from './street.model';
import { TypeCover } from './cover-type.model';
import { PolicePost } from './police-post.model';
import { TrafficSigns } from './traffic-signs.model';
import { Driver } from './driver.model';
import { TypeFine } from './fine-type.model';

export interface UDS {
    id_uds: number;
    name: string;
    crossroads: Crossroad[];
    roads: Road[];
    route: Route | null;
}

export interface Crossroad {
    id_crossroad: number;
    id_uds: number;
    x: number;
    y: number;
    traffic_light: TrafficLights | null;
}

export interface Road {
    crossroad_1: number;
    crossroad_2: number;
    street: Street;
    traffic_signs: TrafficSigns | null;
    type_cover: TypeCover;
    police_post: PolicePost | null;
    length: number;
    direction: number;
}

export interface Route {
    start_crossroad: number;
    end_crossroad: number;
    driver: Driver;
    criteria_searche: string;
    all_routes: Routes_Map[];
    type_fines: TypeFine[];
}

export interface Routes_Map {
    name: string;
    time_spend_one_element: number[];
    criteria_one_element: number[];
    route: number[];
}