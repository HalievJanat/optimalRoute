
export namespace ClassOptimalRoute {
    export class Crossroad {
        private x: number;
        private y: number;

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

        constructor() {
            this.x = 0;
            this.y = 0;
        }
    }

    export class Road {
        private crossroad_1: number;
        private crossroad_2: number;

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

        constructor() {
            this.crossroad_1 = 0;
            this.crossroad_2 = 0;
        }
    }
}