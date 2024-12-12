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
    isLeftPanelOpen = true;
    isRightPanelOpen = true;

    private stage: Konva.Stage = {} as any;
    private layer: Konva.Layer = {} as any;

    //Метод для правой панели
    methodRightPanelOpen(): void {
        if (this.isRightPanelOpen == true)
            this.stage.width(window.innerWidth / 100 * 75);
        else this.stage.width(window.innerWidth / 100 * 56);
        this.isRightPanelOpen = !this.isRightPanelOpen;
        this.drawGrid();
        this.layer.draw();
    }

    //Метод для левой панели
    methodLeftPanelOpen(): void {
        if (this.isLeftPanelOpen == true)
            this.stage.width(window.innerWidth / 100 * 75);
        else this.stage.width(window.innerWidth / 100 * 56);
        this.isLeftPanelOpen = !this.isLeftPanelOpen;
        this.drawGrid();
        this.layer.draw();
    }

    ngOnInit(): void {
        // Инициализация сцены
        this.stage = new Konva.Stage({
            container: 'container', // ID контейнера
            width: window.innerWidth / 100 * 56,
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
            fill: 'blue',
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
}
