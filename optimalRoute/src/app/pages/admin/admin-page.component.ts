import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import Konva from 'konva';
import { ClassOptimalRoute } from '../../classJSON/ClassOptimalRoure';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-page',
    standalone: true,
    imports: [HeaderComponent, CommonModule],
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {
    isContextMenuVisible = false; // Показывать ли меню
    contextMenuPosition = { x: 0, y: 0 }; // Координаты меню

    indexSelectedElement = -1;

    [x: string]: any;
    isLeftPanelOpen = true;
    isRightPanelOpen = true;
    crossroadList: ClassOptimalRoute.Crossroad[] = [];
    roadList: ClassOptimalRoute.Road[] = [];

    gridSize = 50; // Масштаб
    radius = (this.gridSize * 2) / 5;

    isCrossroadAdd = false;

    isRoadAdd = false;
    indexCrossroad1 = -1;

    private stage: Konva.Stage = {} as any;
    private layer: Konva.Layer = {} as any;

    ngOnInit(): void {
        this.createStage((window.innerWidth / 100) * 56);
    }

    //Метод для правой панели
    methodRightPanelOpen(): void {
        this.isRightPanelOpen = !this.isRightPanelOpen;
        this.gridDrowSize();

        let tempGridSize = this.gridSize;
        this.drawScaleCanvas(tempGridSize);
    }

    //Метод для левой панели
    methodLeftPanelOpen(): void {
        this.isLeftPanelOpen = !this.isLeftPanelOpen;
        this.gridDrowSize();

        let tempGridSize = this.gridSize;
        this.drawScaleCanvas(tempGridSize);
    }

    private gridDrowSize(): void {
        if (this.isRightPanelOpen == true && this.isLeftPanelOpen == true) {
            this.createStage((window.innerWidth / 100) * 56);
        } else if (
            this.isRightPanelOpen == true ||
            this.isLeftPanelOpen == true
        ) {
            this.createStage((window.innerWidth / 100) * 75);
        } else this.createStage((window.innerWidth / 100) * 94);
    }

    private createStage(wight: number): void {
        // Инициализация сцены
        this.stage = new Konva.Stage({
            container: 'container', // ID контейнера
            width: wight,
            height: (window.innerHeight / 100) * 91,
        });

        // Создаём слой
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        // Рисуем сетку
        this.drawGrid();
    }

    private drawGrid(): void {
        const width = this.stage.width();
        const height = this.stage.height();

        for (let x = 0; x < width; x += this.gridSize) {
            this.drawLine(x, 0, x, height, '#ddd');
        }
        for (let y = 0; y < height; y += this.gridSize) {
            this.drawLine(0, y, width, y, '#ddd');
        }
    }

    addCrossroad(): void {
        if (this.crossroadList.length == 30) {
            alert('Больше 30 нельзя');
            return;
        }
        this.isCrossroadAdd = true;
        this.isRoadAdd = false;
        this.indexCrossroad1 = -1;
    }

    eventClickConvas(X: number, Y: number): void {
        this.isContextMenuVisible = false; // Показывать ли меню
        X = Math.round(X / this.gridSize) * this.gridSize;
        Y = Math.round(Y / this.gridSize) * this.gridSize;
        if (X == 0) X += this.gridSize;
        else if (X == this.stage.width()) X -= this.gridSize;

        if (Y == 0) Y += this.gridSize;
        else if (Y == this.stage.height()) Y -= this.gridSize;

        if (this.isCrossroadAdd == true) {
            for (let i = 0; i < this.crossroadList.length; i++) {
                if (
                    this.crossroadList[i].X == X &&
                    this.crossroadList[i].Y == Y
                ) {
                    return;
                }
            }
            const circle = new Konva.Circle({
                x: X,
                y: Y,
                radius: (this.gridSize * 2) / 5,
                stroke: '#000',
                full: '#fff',
                //draggable: true, // Включаем перетаскивание
            });

            this.layer.add(circle);

            // Обновляем слой
            this.layer.draw();

            this.isCrossroadAdd = false;

            let crossroad = new ClassOptimalRoute.Crossroad();
            crossroad.X = X;
            crossroad.Y = Y;
            this.crossroadList.push(crossroad);
            const jsonCrossroad: string = JSON.stringify(this.crossroadList);
            console.log(jsonCrossroad);
        } else if (this.isRoadAdd == true && this.indexCrossroad1 >= 0) {
            let i = 0;
            while (i < this.crossroadList.length) {
                if (
                    this.crossroadList[i].X == X &&
                    this.crossroadList[i].Y == Y
                ) {
                    break;
                }
                i++;
            }
            if (i == this.crossroadList.length) {
                alert('Лох, тут не перекрестка');
                return;
            } else if (i == this.indexCrossroad1) {
                alert('Лох, ты куда прогон добавляешь');
                return;
            }

            let j = 0;
            let countIndex = 1;
            while (j < this.roadList.length) {
                if (
                    this.roadList[j].Crossroad1 == i ||
                    this.roadList[j].Crossroad2 == i
                ) {
                    countIndex++;
                }
                if (countIndex > 4) {
                    alert('Лох, больше 4 нельзя');
                    return;
                }
                j++;
            }

            for (let y = 0; y < this.roadList.length; y++) {
                if (
                    (this.roadList[y].Crossroad1 == this.indexCrossroad1 &&
                        this.roadList[y].Crossroad2 == i) ||
                    (this.roadList[y].Crossroad2 == this.indexCrossroad1 &&
                        this.roadList[y].Crossroad1 == i)
                ) {
                    alert('Нельзя добавить прогон!!!');
                    this.isRoadAdd = false;
                    return;
                }
            }

            let ky = this.calculateKLine(
                this.crossroadList[this.indexCrossroad1].X,
                this.crossroadList[this.indexCrossroad1].Y,
                X,
                Y
            );
            let by = this.calculateBLine(
                this.crossroadList[this.indexCrossroad1].Y,
                ky,
                this.crossroadList[this.indexCrossroad1].X
            );
            let x1;
            let x2;
            let y1;
            let y2;
            
            if (ky != Infinity && ky != -Infinity) {
                x1 = this.calculateXCoordinate(ky, by, this.crossroadList[this.indexCrossroad1].X,
                    this.crossroadList[this.indexCrossroad1].Y, this.radius, this.crossroadList[this.indexCrossroad1].X > X);
                x2 = this.calculateXCoordinate(ky, by, X, Y, this.radius, this.crossroadList[this.indexCrossroad1].X < X);
                y1 = this.calculateYCoordinate(ky, by, x1);
                y2 = this.calculateYCoordinate(ky, by, x2);
            } else if (this.crossroadList[this.indexCrossroad1].Y > Y){
                x1 = this.crossroadList[this.indexCrossroad1].X; 
                x2 = X;
                y1 = this.crossroadList[this.indexCrossroad1].Y - this.radius;
                y2 = Y + this.radius;
            } else {
                x1 = this.crossroadList[this.indexCrossroad1].X; 
                x2 = X;
                y1 = this.crossroadList[this.indexCrossroad1].Y + this.radius;
                y2 = Y - this.radius;
            }

            this.drawLine(
                x1,
                y1,
                x2,
                y2,
                '#000'
            );

            this.isRoadAdd = false;

            let road = new ClassOptimalRoute.Road();
            road.Crossroad1 = this.indexCrossroad1;
            road.Crossroad2 = i;
            this.roadList.push(road);
            const jsonRoad: string = JSON.stringify(this.roadList);
            console.log(jsonRoad);
            this.indexCrossroad1 = -1;
        } else if (this.isRoadAdd == true) {
            let i = 0;
            while (i < this.crossroadList.length) {
                if (
                    this.crossroadList[i].X == X &&
                    this.crossroadList[i].Y == Y
                ) {
                    break;
                }
                i++;
            }

            if (this.crossroadList.length == i) {
                alert('Лох, тут не перекрестка');
                return;
            }

            let j = 0;
            let countIndex = 1;
            while (j < this.roadList.length) {
                if (
                    this.roadList[j].Crossroad1 == i ||
                    this.roadList[j].Crossroad2 == i
                ) {
                    countIndex++;
                }
                if (countIndex > 4) {
                    alert('Лох, больше 4 нельзя');
                    return;
                }
                j++;
            }
            this.indexCrossroad1 = i;
        }
    }

    addRoad(): void {
        if (this.crossroadList.length == 60) {
            alert('Больше 60 нельзя');
            return;
        }
        this.isCrossroadAdd = false;
        this.isRoadAdd = true;
        this.indexCrossroad1 = -1;
    }

    replaceSizeGrid(flag: boolean): void {
        let tempGridSize = this.gridSize;
        if (!flag && this.gridSize > 30) this.gridSize -= 10;
        else if (flag && this.gridSize < 100) this.gridSize += 10;
        else return;
        this.gridDrowSize();

        this.drawScaleCanvas(tempGridSize);
    }

    private drawScaleCanvas(tempGridSize: number): void {
        for (let i = 0; i < this.crossroadList.length; i++) {
            this. radius = (this.gridSize * 2) / 5;
            this.crossroadList[i].X =
                Math.round(this.crossroadList[i].X / tempGridSize) *
                this.gridSize;
            this.crossroadList[i].Y =
                Math.round(this.crossroadList[i].Y / tempGridSize) *
                this.gridSize;

            const circle = new Konva.Circle({
                x: this.crossroadList[i].X,
                y: this.crossroadList[i].Y,
                radius: this.radius,
                stroke: '#000',
                full: '#fff',
                //draggable: true, // Включаем перетаскивание
            });

            this.layer.add(circle);

            // Обновляем слой
            this.layer.draw();
        }

        for (let i = 0; i < this.roadList.length; i++) {
            let ky = this.calculateKLine(
                this.crossroadList[this.roadList[i].Crossroad1].X,
                this.crossroadList[this.roadList[i].Crossroad1].Y,
                this.crossroadList[this.roadList[i].Crossroad2].X,
                this.crossroadList[this.roadList[i].Crossroad2].Y
            );
            let by = this.calculateBLine(
                this.crossroadList[this.roadList[i].Crossroad1].Y,
                ky,
                this.crossroadList[this.roadList[i].Crossroad1].X
            );
            let x1;
            let x2;
            let y1;
            let y2;
            
            if (ky != Infinity && ky != -Infinity) {
                x1 = this.calculateXCoordinate(ky, by, this.crossroadList[this.roadList[i].Crossroad1].X,
                    this.crossroadList[this.roadList[i].Crossroad1].Y, this.radius, 
                    this.crossroadList[this.roadList[i].Crossroad1].X > this.crossroadList[this.roadList[i].Crossroad2].X);
                x2 = this.calculateXCoordinate(ky, by,this.crossroadList[this.roadList[i].Crossroad2].X,
                    this.crossroadList[this.roadList[i].Crossroad2].Y, this.radius,
                    this.crossroadList[this.roadList[i].Crossroad1].X < this.crossroadList[this.roadList[i].Crossroad2].X);
                y1 = this.calculateYCoordinate(ky, by, x1);
                y2 = this.calculateYCoordinate(ky, by, x2);
            } else if (this.crossroadList[this.roadList[i].Crossroad1].Y > this.crossroadList[this.roadList[i].Crossroad2].Y){
                x1 = this.crossroadList[this.roadList[i].Crossroad1].X; 
                x2 = this.crossroadList[this.roadList[i].Crossroad2].X;
                y1 = this.crossroadList[this.roadList[i].Crossroad1].Y - this.radius;
                y2 = this.crossroadList[this.roadList[i].Crossroad2].Y + this.radius;
            } else {
                x1 = this.crossroadList[this.roadList[i].Crossroad1].X; 
                x2 = this.crossroadList[this.roadList[i].Crossroad2].X;
                y1 = this.crossroadList[this.roadList[i].Crossroad1].Y + this.radius;
                y2 = this.crossroadList[this.roadList[i].Crossroad2].Y - this.radius
            }

            this.drawLine(
                x1,
                y1,
                x2,
                y2,
                '#000'
            );
        }
    }

    contextMenu(X: number, Y: number) {
        alert('Тут должно быть контекстное меню!!!' + X + ' ,' + Y);
    }

    checkLimitRoadForCrossroad() {}

    private calculateCoordinateX1():number {


        return 0;
    }

    private drawLine(x1: number, y1: number, x2: number, y2: number, stroke: string): void {
        this.layer.add(
            new Konva.Line({
                points: [x1, y1, x2, y2],
                stroke: stroke,
                strokeWidth: 1,
            })
        );
    }

    private calculateKLine(x1: number, y1: number, x2: number, y2: number): number {
        return (y1 - y2)/  (x1 -  x2);
    }

    private calculateBLine(y: number, k: number, x: number): number {
        return y - k * x;
    }

    private calculateXCoordinate(ky:number, by:number, xc:number, yc:number, r:number, flag:boolean): number {
        let a = 1 + Math.pow(ky,2);
        let b = 2*ky*by - 2*ky*yc - 2*xc;
        let c = Math.pow(xc,2) +  Math.pow(yc,2) - Math.pow(r,2) + Math.pow(by,2) - 2*by*yc;

        let d = Math.pow(b,2) - 4*a*c;
        let x;

        if (flag) x = (-b - Math.sqrt(d))/(2*a);
        else x = (-b + Math.sqrt(d))/(2*a);

        return x;
    }

    private calculateYCoordinate(k:number, b:number, x:number): number {
        return k*x + b;
    }

    openContextMenu(event: MouseEvent): void {
        event.preventDefault(); // Отключаем стандартное меню браузера
        if (this.defineClickCrossroad(event.layerX, event.layerY)) {    
            this.isContextMenuVisible = true;
            this.contextMenuPosition = {
                x: event.clientX, // Горизонтальная позиция мыши
                y: event.clientY, // Вертикальная позиция мыши
            };
        } else if (this.defineClickRoad(event.layerX, event.layerY)) {    
            this.isContextMenuVisible = true;
            this.contextMenuPosition = {
                x: event.clientX, // Горизонтальная позиция мыши
                y: event.clientY, // Вертикальная позиция мыши
            };
        }
    }

    closeContextMenu(): void {
        this.isContextMenuVisible = false;
    }

    action1(): void {
        console.log('Действие 1 выполнено');
        this.closeContextMenu();
    }

    action2(): void {
        console.log('Действие 2 выполнено');
        this.closeContextMenu();
    }

    private defineClickCrossroad(x: number, y: number): boolean {    
        for (let i = 0; i < this.crossroadList.length; i++) {
            let x0 = this.crossroadList[i].X;
            let y0 = this.crossroadList[i].Y;
            let r = Math.pow((x - x0), 2) + Math.pow((y - y0), 2); 
            if (r <= Math.pow(this.radius,2)) {
                this.indexSelectedElement = i;
                return true;
            }
        }
        return false;
    }

    private defineClickRoad(x: number, y: number): boolean {    
        for (let i = 0; i < this.roadList.length; i++) {
            let k = this.calculateKLine(
                this.crossroadList[this.roadList[i].Crossroad1].X,
                this.crossroadList[this.roadList[i].Crossroad1].Y,
                this.crossroadList[this.roadList[i].Crossroad2].X,
                this.crossroadList[this.roadList[i].Crossroad2].Y
            );
            let b = this.calculateBLine(
                this.crossroadList[this.roadList[i].Crossroad1].Y,
                k,
                this.crossroadList[this.roadList[i].Crossroad1].X
            );

            let y1 = (k*x + b);
            let y2 = (k*x + b + 1);
            let y3 = (k*x + b - 1);
            let y4 = (k*x + b + 2);
            let y5 = (k*x + b - 2);

            if (y == y1 || y == y2 || y == y3 || y == y4 || y == y5) {
                this.indexSelectedElement = i;
                return true;
            }
        }
        return false;
    }
}
