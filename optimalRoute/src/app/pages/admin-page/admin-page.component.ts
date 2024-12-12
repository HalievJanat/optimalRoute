import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import Konva from 'konva';

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
        this.createStage(this.isRightPanelOpen == true? window.innerWidth / 100 * 75 : window.innerWidth / 100 * 56);
        this.isRightPanelOpen = !this.isRightPanelOpen;
    }

    //Метод для левой панели
    methodLeftPanelOpen(): void {
        this.createStage(this.isLeftPanelOpen == true? window.innerWidth / 100 * 75 : window.innerWidth / 100 * 56);
        this.isLeftPanelOpen = !this.isLeftPanelOpen;
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

        // Добавляем примерную вершину
        const circle = new Konva.Circle({
            x: 100,
            y: 100,
            radius: 20,
            stroke: '#000', 
            draggable: true, // Включаем перетаскивание
        });
        this.layer.add(circle);

        // Обновляем слой
        this.layer.draw();
    }

    private drawGrid(): void {
        const gridSize = 50; 
        const width = this.stage.width();
        const height = this.stage.height();

        for (let x = 0; x < width; x += gridSize) {
            this.layer.add(
                new Konva.Line({
                    points: [x, 0, x, height],
                    stroke: '#ddd',
                    strokeWidth: 1,
                })
            );
        }
        for (let y = 0; y < height; y += gridSize) {
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
    }

    eventClickConvas(X: number, Y: number): void {
        if (this.isCrossroadAdd == true) {
            const circle = new Konva.Circle({
                x: X,
                y: Y,
                radius: 20,
                stroke: '#000',
                draggable: true, // Включаем перетаскивание
            });
    
            this.layer.add(circle);
    
            // Обновляем слой
            this.layer.draw();

            this.isCrossroadAdd = false;
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
        }
        else if (this.isRoadAdd == true) {
            this.firstCoordinateX = X;
            this.firstCoordinateY = Y;
        }
    }

    addRoad(): void {
        this.isCrossroadAdd = false;
        this.isRoadAdd = true;
    }
}
