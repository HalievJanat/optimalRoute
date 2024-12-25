export interface PolicePost {
    corruption: DegreeCorruption;
}

export interface DegreeCorruption {
    id_corruption: number;
    name: string;
    coefficient_corruption: number;
}
