import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import Konva from 'konva';
import {ClassOptimalRoute} from "../../classJSON/ClassOptimalRoure"


@Component({
    selector: 'app-admin-page',
    standalone: true,
    imports: [HeaderComponent, NgbDatepickerModule],
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {
    [x: string]: any;
    isLeftPanelOpen = true;
    isRightPanelOpen = true;
    crossroadList: ClassOptimalRoute.Crossroad[] = [];
    roadList: ClassOptimalRoute.Road[] = [];

    gridSize = 50; // Масштаб

    isCrossroadAdd = false;

    isRoadAdd = false;
    firstCoordinateX = -10;
    firstCoordinateY = -10;

    private stage: Konva.Stage = {} as any;
    private layer: Konva.Layer = {} as any;
    
    ngOnInit(): void {
        this.createStage(window.innerWidth / 100 * 56);
    }

    //Метод для правой панели
    methodRightPanelOpen(): void {
        this.isRightPanelOpen = !this.isRightPanelOpen;
        this.gridDrowSize();
        
    }

    //Метод для левой панели
    methodLeftPanelOpen(): void {
        this.isLeftPanelOpen = !this.isLeftPanelOpen;
        this.gridDrowSize();
    }

    private gridDrowSize(): void {
        if (this.isRightPanelOpen == true && this.isLeftPanelOpen == true) {
            this.createStage(window.innerWidth / 100 * 56);
        } else if (this.isRightPanelOpen == true || this.isLeftPanelOpen == true) {
            this.createStage(window.innerWidth / 100 * 75);
        } else this.createStage(window.innerWidth / 100 * 94);
    }

    private createStage(wight: number): void {
        // Инициализация сцены
        this.stage = new Konva.Stage({
            container: 'container', // ID контейнера
            width: wight,
            height: window.innerHeight / 100 * 91,
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
            this.layer.add(
                new Konva.Line({
                    points: [x, 0, x, height],
                    stroke: '#ddd',
                    strokeWidth: 1,
                })
            );
        }
        for (let y = 0; y < height; y += this.gridSize) {
            this.layer.add(
                new Konva.Line({
                    points: [0, y, width, y],
                    stroke: '#ddd',
                    strokeWidth: 1,
                })
            );
        }
    }

    addCrossroad(): void {
        this.isCrossroadAdd = true;
        this.isRoadAdd = false;
        this.firstCoordinateX = -10;
        this.firstCoordinateY = -10;
    }

    eventClickConvas(X: number, Y: number): void {
        X = Math.round(X / this.gridSize) * this.gridSize;
        Y = Math.round(Y / this.gridSize) * this.gridSize;
        if (this.isCrossroadAdd == true) {
            const circle = new Konva.Circle({
                x: X,
                y: Y,
                radius: this.gridSize * 2 / 5,
                stroke: '#000',
                full: '#fff',
                draggable: true, // Включаем перетаскивание
            });
    
            this.layer.add(circle);
    
            // Обновляем слой
            this.layer.draw();

            this.isCrossroadAdd = false;

            let crossroad  = new ClassOptimalRoute.Crossroad();
            crossroad.X = X;
            crossroad.Y = Y;
            this.crossroadList.push(crossroad);
            const jsonCrossroad: string = JSON.stringify(this.crossroadList);
            console.log(jsonCrossroad);
        }
        else if (this.isRoadAdd == true && this.firstCoordinateX >= 0) {
            const line = new Konva.Line({
                points: [this.firstCoordinateX, this.firstCoordinateY, X, Y],
                stroke: '#000',
                strokeWidth: 1,
            })
    
            this.layer.add(line);
    
            // Обновляем слой
            this.layer.draw();

            this.isCrossroadAdd = false;

            let road  = new ClassOptimalRoute.Road();
            road.Crossroad1 = X;
            road.Crossroad2 = Y;
            this.roadList.push(road);
            const jsonRoad: string = JSON.stringify(this.roadList);
            console.log(jsonRoad);
        }
        else if (this.isRoadAdd == true) {
            this.firstCoordinateX = X;
            this.firstCoordinateY = Y;
        }
    }

    addRoad(): void {
        this.isCrossroadAdd = false;
        this.isRoadAdd = true;
        this.firstCoordinateX = -10;
        this.firstCoordinateY = -10;
    }

    replaceSizeGrid(flag: boolean) {
        if (!flag && this.gridSize > 30) this.gridSize -= 10;
        else if (flag && this.gridSize < 100) this.gridSize += 10;
        this.gridDrowSize();
    }
}
