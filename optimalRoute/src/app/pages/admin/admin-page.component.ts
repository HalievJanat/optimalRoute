import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import Konva from 'konva';
import { ClassOptimalRoute } from '../../classJSON/ClassOptimalRoute';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-admin-page',
    standalone: true,
    imports: [HeaderComponent, CommonModule],
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.scss',
})

export class AdminPageComponent {
    constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
	) {
		// customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
	}

    open(content: any) {
		this.modalService.open(content);
	}

    isContextMenuVisibleCrossroad = false; // Показывать ли меню
    isContextMenuVisibleRoad = false; // Показывать ли меню
    contextMenuPosition = { x: 0, y: 0 }; // Координаты меню
    indexSelectedElement = -1;

    isLeftClickCrossroad = false;
    isLeftClickRoad = false;

    isAddTrafficLights = false;
    isAddPolicePost = false;
    isAddTrafficSigns = false;

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
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        this.isRightPanelOpen = !this.isRightPanelOpen;
        this.gridDrowSize();

        let tempGridSize = this.gridSize;
        this.drawScaleCanvas(tempGridSize);
    }

    //Метод для левой панели
    methodLeftPanelOpen(): void {
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
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
            this.drawLine(x, 0, x, height, '#ddd', -1);
        }
        for (let y = 0; y < height; y += this.gridSize) {
            this.drawLine(0, y, width, y, '#ddd', -1);
        }
    }

    addCrossroad(): void {
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        if (this.crossroadList.length == 30) {
            alert('Больше 30 нельзя');
            return;
        }
        this.isCrossroadAdd = true;
        this.isRoadAdd = false;
        this.indexCrossroad1 = -1;
    }

    eventClickConvas(coordX: number, coordY: number): void {
        this.isContextMenuVisibleCrossroad = false; // Показывать ли меню
        this.isContextMenuVisibleRoad = false;      // Показывать ли 
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        let X = Math.round(coordX / this.gridSize) * this.gridSize;
        let Y = Math.round(coordY / this.gridSize) * this.gridSize;
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

            if(!this.checkIntersectionRoad(X, Y)) {
                alert("Здесь нельзя установить перекресток");
                return;
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
                alert('Перекресток не найден!');
                return;
            } else if (i == this.indexCrossroad1) {
                alert('Прогон нельзя добавить к данным объектам!');
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
                    alert('Больше 4 прогонов добавить нельзя');
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

            if(!this.checkIntersectionCrossroad(ky, by, this.indexCrossroad1, i)) {
                alert("Здесь нельзя установить прогон");
                return;
            }
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

            let road = new ClassOptimalRoute.Road();
            this.drawLine(
                x1,
                y1,
                x2,
                y2,
                '#000',
                road.Direction
            );

            this.isRoadAdd = false;

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
                alert('Перекресток не найден');
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
                    alert('Больше 4 прогонов добавить нельзя');
                    return;
                }
                j++;
            }
            this.indexCrossroad1 = i;
        }
    }

    checkIntersectionCrossroad(ky: number, by:number, crossroad1:number, crossroad2:number): boolean { 
        let x1 = this.crossroadList[crossroad1].X;
        let y1 = this.crossroadList[crossroad1].Y;
        let x2 = this.crossroadList[crossroad2].X;
        let y2 = this.crossroadList[crossroad2].Y;

        if (x1 < x2) {
            x1 = this.crossroadList[crossroad2].X;
            x2 = this.crossroadList[crossroad1].X;
        }
        if (y1 < y2) {
            y1 = this.crossroadList[crossroad2].Y;
            y2 = this.crossroadList[crossroad1].Y;
        }

        for (let i = 0; i < this.crossroadList.length; i++) {
            if (i == crossroad1 || i == crossroad2) continue;
            let x = this.crossroadList[i].X;
            let y = this.crossroadList[i].Y;
            if (x > x1 || x < x2 || y > y1 || y < y2) continue;
            if (ky != Infinity && ky != -Infinity) {
                if(this.calculateXCoordinate(ky, by, x, y, this.radius, true) != -1000) return false;
            } else if (x == x1) {
                return false;
            }
        }
        return true;
    }

    checkIntersectionRoad(x: number, y:number): boolean {
        for(let i = 0; i <this.roadList.length; i++) {
            let x1 = this.crossroadList[this.roadList[i].Crossroad1].X;
            let x2 = this.crossroadList[this.roadList[i].Crossroad2].X;
            let y1 = this.crossroadList[this.roadList[i].Crossroad1].Y;
            let y2 = this.crossroadList[this.roadList[i].Crossroad2].Y;

            let ky = this.calculateKLine(
                x1,
                y1,
                x2,
                y2,
            );
            let by = this.calculateBLine(
                y1,
                ky,
                x1
            );

            if (x1 < x2) {
                x1 = x2;
                x2 = this.crossroadList[this.roadList[i].Crossroad1].X;
            }
            if (y1 < y2) {
                y1 = y2;
                y2 = this.crossroadList[this.roadList[i].Crossroad1].Y;
            }

            if (x > x1 || x < x2 || y > y1 || y < y2) continue;
            
            if (ky != Infinity && ky != -Infinity) {
                if(this.calculateXCoordinate(ky, by, x, y, this.radius, true) != -1000) return false;
            } else if (x == x1) {
                return false;
            }
        }
        return true;
    }

    evenDoubleClickConvas(X: number, Y: number): void {
        this.isCrossroadAdd = false;
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        if (this.defineClickCrossroad(X, Y)) {
            this.isLeftClickCrossroad = true;
        } else if (this.defineClickRoad(X, Y)) {
            this.isLeftClickRoad = true;
        }
    }

    addRoad(): void {
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        if (this.crossroadList.length == 60) {
            alert('Больше 60 нельзя');
            return;
        }
        this.isCrossroadAdd = false;
        this.isRoadAdd = true;
        this.indexCrossroad1 = -1;
    }

    replaceSizeGrid(flag: boolean): void {
        this.isLeftClickCrossroad = false;
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        this.isLeftClickRoad = false;
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
                '#000',
                this.roadList[i].Direction
            );
        }
    }

    private drawLine(x1: number, y1: number, x2: number, y2: number, stroke: string, direction: number): void {
        if (direction == -1 || direction == 0) {
            this.layer.add(
                new Konva.Line({
                    points: [x1, y1, x2, y2],
                    stroke: stroke,
                    strokeWidth: 1,
                })
            );
        } else if (direction == 1) {
            this.layer.add(
                new Konva.Arrow({
                    points: [x1, y1, x2, y2],
                    stroke: stroke,
                    strokeWidth: 1,
                    fill: 'black'
                })
            );
        } else if (direction == 2) {
            this.layer.add(
                new Konva.Arrow({
                    points: [x2, y2, x1, y1],
                    stroke: stroke,
                    strokeWidth: 1,
                    fill: 'black'
                })
            );
        }      
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
        if (d < 0 ) return -1000;
        let x;

        if (flag) x = (-b - Math.sqrt(d))/(2*a);
        else x = (-b + Math.sqrt(d))/(2*a);

        return x;
    }

    private calculateYCoordinate(k:number, b:number, x:number): number {
        return k*x + b;
    }

    openContextMenu(event: MouseEvent): void {
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        event.preventDefault(); // Отключаем стандартное меню браузера
        if (this.defineClickCrossroad(event.layerX, event.layerY)) {    
            this.isContextMenuVisibleCrossroad = true;
            this.isContextMenuVisibleRoad = false;
            this.contextMenuPosition = {
                x: event.clientX, // Горизонтальная позиция мыши
                y: event.clientY, // Вертикальная позиция мыши
            };
        } else if (this.defineClickRoad(event.layerX, event.layerY)) {    
            this.isContextMenuVisibleRoad = true;
            this.isContextMenuVisibleCrossroad = false;
            this.contextMenuPosition = {
                x: event.clientX, // Горизонтальная позиция мыши
                y: event.clientY, // Вертикальная позиция мыши
            };
        }
    }

    closeContextMenu(): void {
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
        this.isContextMenuVisibleCrossroad = false;
        this.isContextMenuVisibleRoad = false;
    }

    actionDeleteCrossroad(): void {
        this.crossroadList.splice(this.indexSelectedElement, 1);

        let i = 0;
        while (i <this.roadList.length) {
            if (this.roadList[i].Crossroad1 > this.indexSelectedElement) {
                this.roadList[i].Crossroad1 -= 1;
            } else if (this.roadList[i].Crossroad1 == this.indexSelectedElement) {
                this.roadList.splice(i, 1);
                continue;
            }
            if (this.roadList[i].Crossroad2 > this.indexSelectedElement) {
                this.roadList[i].Crossroad2 -= 1;
            } else if (this.roadList[i].Crossroad2 == this.indexSelectedElement) {
                this.roadList.splice(i, 1);
                continue;
            }
            i++;
        }

        this.gridDrowSize();
        this.drawScaleCanvas(this.gridSize);
        this.closeContextMenu();
    }

    actionDeleteRoad(): void {
        this.roadList.splice(this.indexSelectedElement, 1);

        this.gridDrowSize();
        this.drawScaleCanvas(this.gridSize);
        this.closeContextMenu();
    }

    actionAddTrafficLights(): void {
        this.isAddTrafficLights = true;
    
        this.closeContextMenu();
    }

    actionDeleteTrafficLights(): void {
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;

        this.crossroadList[this.indexSelectedElement].TrafficLights = null;
        this.closeContextMenu();
    }

    actionAddTrafficSigns(): void {
        this.isAddTrafficSigns = true;

        this.closeContextMenu();
    }

    actionDeleteTrafficSigns(): void {
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;

        this.roadList[this.indexSelectedElement].TrafficSigns = null;
        this.closeContextMenu();
    }

    actionAddPolicePost(): void {
        this.isAddPolicePost = true;

        this.closeContextMenu();
    }

    actionDeletePolicePost(): void {
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;

        this.roadList[this.indexSelectedElement].PolicePost = null;
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
            
            if (k == Infinity || k == -Infinity) {
                let x1 = this.crossroadList[this.roadList[i].Crossroad1].X;
                let yMax = this.crossroadList[this.roadList[i].Crossroad1].Y;
                let yMin = this.crossroadList[this.roadList[i].Crossroad2].Y;
                if (yMax < yMin) {
                    yMax = this.crossroadList[this.roadList[i].Crossroad2].Y;
                    yMin = this.crossroadList[this.roadList[i].Crossroad1].Y;
                }

                if (x > x1 - 3 && x < x1 + 3 && y > yMin && y < yMax) {
                    this.indexSelectedElement = i;
                    return true;
                }
            } else {
                for (let j = 0; j < 6; j++) {
                    let y1 = (k*x + b + j);
                    let y2 = (k*x + b - j);
                    if (y == y1 || y == y2) {
                        this.indexSelectedElement = i;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    modifyCrossroadParamener():void {
        let timeRedSignalString = (<HTMLInputElement> document.querySelector(".timeRedSignal")).value;
        let timeGreenSignalString = (<HTMLInputElement> document.querySelector(".timeGreenSignal")).value;
        if (timeRedSignalString == "") {
            alert('Введите значение для длительности красной фазы');
            return;
        }
        if (timeGreenSignalString == "") {
            alert('Введите значение для длительности зеденой фазы');
            return;
        }

        let timeRedSignal = Number(timeRedSignalString);
        let timeGreenSignal = Number(timeGreenSignalString);

        if (timeRedSignal >= 20 && timeRedSignal <= 120) {
            this.crossroadList[this.indexSelectedElement].TrafficLights!.TimeRedSignal = timeRedSignal;
        } else {
            alert('Значение красного сигнала должно быть от 20 до 120');
            return;
        }

        if (timeGreenSignal >= 20 && timeGreenSignal <= 120) {
            this.crossroadList[this.indexSelectedElement].TrafficLights!.TimeGreenSignal =  timeGreenSignal;
        } else {
            alert('Значение зеленого сигнала должно быть от 20 до 120');
            return;
        }
  
        const jsonCrossroad: string = JSON.stringify(this.crossroadList);
        console.log(jsonCrossroad);
        
        this.isAddTrafficLights = false;
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
    }

    modifyRoadParamener():void {
        let directionString = (<HTMLInputElement> document.querySelector("#direction")).value;
        this.roadList[this.indexSelectedElement].Direction = Number(directionString);

        let nameStreet = (<HTMLInputElement> document.querySelector(".streetName")).value;

        if (nameStreet.length >= 1 && nameStreet.length <=30) {
            this.roadList[this.indexSelectedElement].Street.Name = nameStreet;
        } else {
            alert('Длина название улица должны быть от 1 до 30');
            return;
        }

        let lengthRoad = (<HTMLInputElement> document.querySelector(".lengthRoad")).value;
        let numberLengthRoad;

        if (lengthRoad != '') {
            numberLengthRoad = Number(lengthRoad);
        } else {
            alert('Введите значение длины');
            return;
        }

        if (numberLengthRoad >= 1 && numberLengthRoad <= 10) {
            this.roadList[this.indexSelectedElement].Length = numberLengthRoad;
        } else {
            alert('Длина дороги должна быть от 1 до 10');
            return;
        }

        let nameTypeCover = (<HTMLInputElement> document.querySelector(".typeCoverName")).value;
        if (nameTypeCover.length <= 15) {
            this.roadList[this.indexSelectedElement].TypeCover.Name = nameTypeCover;
        } else {
            alert('Длина названия покрытия должна быть до 15 символов');
            return;
        }

        let coefficientBrakingRoad = (<HTMLInputElement> document.querySelector(".coeffCover")).value;
        let numberCoefficientBrakingRoad;

        if (coefficientBrakingRoad != '') {
            numberCoefficientBrakingRoad = Number(coefficientBrakingRoad);
        } else {
            alert('Введите коэффициент тормажения');
            return;
        }
        
        if (numberCoefficientBrakingRoad >= 1 && numberCoefficientBrakingRoad <= 2) {
            this.roadList[this.indexSelectedElement].TypeCover.CoefficientBraking = numberCoefficientBrakingRoad;
        } else {
            alert ('Коэффициент торможения должен быть в диапазоне от 1 до 2');
            return;
        }

        if (this.roadList[this.indexSelectedElement].TrafficSigns != null) {
            let speedString = (<HTMLInputElement> document.querySelector("#speedInput")).value;
            this.roadList[this.indexSelectedElement].TrafficSigns!.Speed =  Number(speedString);
        }

        if (this.roadList[this.indexSelectedElement].PolicePost != null) {
            let nameCorruption =  (<HTMLInputElement> document.querySelector(".nameCoeffCorumpInput")).value;
            if (nameCorruption.length <= 15) {
                this.roadList[this.indexSelectedElement].PolicePost!.Corruption.Name = nameCorruption;
            } else {
                alert('Длина названия коэффициента коррумпированности должна быть до 20 символов');
                return;
            }

            let coeffCorumpInput = (<HTMLInputElement> document.querySelector(".coeffCorumpInput")).value;
            let numberСoeffCorumpInput;

            if (coeffCorumpInput != '') {
                numberСoeffCorumpInput = Number(coeffCorumpInput);
            } else {
                alert('Введите коэффициент коррумпированности');
                return;
            }
            
            if (numberСoeffCorumpInput >= 1 && numberСoeffCorumpInput <= 2) {
                this.roadList[this.indexSelectedElement].PolicePost!.Corruption.CoefficientCorruption = numberСoeffCorumpInput;
            } else {
                alert ('Коэффициент коррумпированности должен быть в диапазоне от 1 до 2')
                return;
            }
        }

        const jsonRoad: string = JSON.stringify(this.roadList);
        console.log(jsonRoad);

        this.gridDrowSize();
        this.drawScaleCanvas(this.gridSize);

        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
    }

    addTrafficLights():void {
        let timeRedSignalString = (<HTMLInputElement> document.querySelector(".timeRedSignal")).value;
        let timeGreenSignalString = (<HTMLInputElement> document.querySelector(".timeGreenSignal")).value;
        if (timeRedSignalString == "") {
            alert('Введите значение для длительности красной фазы');
            return;
        }
        if (timeGreenSignalString == "") {
            alert('Введите значение для длительности зеденой фазы');
            return;
        }

        let timeRedSignal = Number(timeRedSignalString);
        let timeGreenSignal = Number(timeGreenSignalString);

        if (timeRedSignal < 20 || timeRedSignal > 120) {
            alert('Значение красного сигнала должно быть от 20 до 120');
            return;
        }

        if (timeGreenSignal < 20 || timeGreenSignal > 120) {
            alert('Значение зеленого сигнала должно быть от 20 до 120');
            return;
        }

        this.crossroadList[this.indexSelectedElement].TrafficLights = new ClassOptimalRoute.TrafficLights();
        this.crossroadList[this.indexSelectedElement].TrafficLights!.TimeRedSignal = timeRedSignal;
        this.crossroadList[this.indexSelectedElement].TrafficLights!.TimeGreenSignal =  timeGreenSignal;

  
        const jsonCrossroad: string = JSON.stringify(this.crossroadList);
        console.log(jsonCrossroad);
        
        this.isAddTrafficLights = false;
    }

    addPolicePost(): void {
        let nameCorruption =  (<HTMLInputElement> document.querySelector(".nameCoeffCorumpInput")).value;
        if (nameCorruption.length >= 15) {
            alert('Длина названия коэффициента коррумпированности должна быть до 20 символов');
            return;
        }

        let coeffCorumpInput = (<HTMLInputElement> document.querySelector(".coeffCorumpInput")).value;
        let numberСoeffCorumpInput;

        if (coeffCorumpInput != '') {
            numberСoeffCorumpInput = Number(coeffCorumpInput);
        } else {
            alert('Введите коэффициент коррумпированности');
            return;
        }
        
        if (numberСoeffCorumpInput < 1 || numberСoeffCorumpInput > 2) {
            alert ('Коэффициент коррумпированности должен быть в диапазоне от 1 до 2')
            return;
        }
        this.roadList[this.indexSelectedElement].PolicePost = new ClassOptimalRoute.PolicePost();
        this.roadList[this.indexSelectedElement].PolicePost!.Corruption.Name = nameCorruption;
        this.roadList[this.indexSelectedElement].PolicePost!.Corruption.CoefficientCorruption = numberСoeffCorumpInput;

        const jsonRoad: string = JSON.stringify(this.roadList);
        console.log(jsonRoad);

        this.isAddPolicePost = false;
    }

    addTrafficSigns():void {
        this.roadList[this.indexSelectedElement].TrafficSigns = new ClassOptimalRoute.TrafficSigns();
        let speedString = (<HTMLInputElement> document.querySelector("#speedInput")).value;
        this.roadList[this.indexSelectedElement].TrafficSigns!.Speed =  Number(speedString);

        const jsonRoad: string = JSON.stringify(this.roadList);
        console.log(jsonRoad);

        this.isAddTrafficSigns = false;
    }

    saveUDS(): void {
        if (this.crossroadList.length < 2 || this.roadList.length < 1) {
            alert('Ошибка, нельзя сохранить карту');
            return;
        }
        let uds = new ClassOptimalRoute.UDS();
        uds.name = 'Samara';
        uds.crossroads = this.crossroadList;
        uds.roads = this.roadList;
        const jsonUDS: string = JSON.stringify(uds);
        console.log(jsonUDS);
    }
}
