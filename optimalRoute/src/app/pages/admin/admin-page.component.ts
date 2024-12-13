import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import Konva from 'konva';
import {ClassOptimalRoute} from "../../classJSON/ClassOptimalRoure"


@Component({
    selector: 'app-admin-page',
    standalone: true,
    imports: [HeaderComponent],
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
    indexCrossroad1 = -1;

    private stage: Konva.Stage = {} as any;
    private layer: Konva.Layer = {} as any;
    
    ngOnInit(): void {
        this.createStage(window.innerWidth / 100 * 56);
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
        if (this.crossroadList.length == 30) {
            alert("Больше 30 нельзя");
            return;
        }
        this.isCrossroadAdd = true;
        this.isRoadAdd = false;
        this.indexCrossroad1 = -1;
    }

    eventClickConvas(X: number, Y: number): void {
        X = Math.round(X / this.gridSize) * this.gridSize;
        Y = Math.round(Y / this.gridSize) * this.gridSize;
        if (X==0) X += this.gridSize;
        else if (X==this.stage.width()) X-=this.gridSize;

        if (Y==0) Y += this.gridSize;
        else if (Y ==this.stage.height()) Y-=this.gridSize;
        
        if (this.isCrossroadAdd == true) {
            for (let i = 0; i < this.crossroadList.length; i++) {
                if (this.crossroadList[i].X == X && this.crossroadList[i].Y == Y) {
                    return;
                }
            }
            const circle = new Konva.Circle({
                x: X,
                y: Y,
                radius: this.gridSize * 2 / 5,
                stroke: '#000',
                full: '#fff',
                //draggable: true, // Включаем перетаскивание
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
        else if (this.isRoadAdd == true && this.indexCrossroad1 >= 0) {
            let i = 0;
            while (i < this.crossroadList.length) {
                if (this.crossroadList[i].X == X && this.crossroadList[i].Y == Y) {
                    break;
                }
                i++;
            }
            if (i == this.crossroadList.length) {
                alert("Лох, тут не перекрестка");
                return;
            } else if (i == this.indexCrossroad1) {
                alert("Лох, ты куда прогон добавляешь");
                return;
            }

            let j = 0;
            let countIndex = 1;
            while (j < this.roadList.length) {
                if (this.roadList[j].Crossroad1 == i || this.roadList[j].Crossroad2 == i) {
                    countIndex++;
                }
                if (countIndex > 4) {
                    alert("Лох, больше 4 нельзя");
                    return;
                }
                j++;
            }

            for (let y = 0; y < this.roadList.length; y++) {
                if (this.roadList[y].Crossroad1 == this.indexCrossroad1 && this.roadList[y].Crossroad2 == i ||
                    this.roadList[y].Crossroad2 == this.indexCrossroad1 && this.roadList[y].Crossroad1 == i
                ) {
                    alert("Нельзя добавить прогон!!!");
                    this.isRoadAdd = false;
                    return;
                } 
            }

            const line = new Konva.Line({
                points: [this.crossroadList[this.indexCrossroad1].X, this.crossroadList[this.indexCrossroad1].Y, X, Y],
                stroke: '#000',
                strokeWidth: 1,
            })
    
            this.layer.add(line);
    
            // Обновляем слой
            this.layer.draw();

            this.isRoadAdd = false;

            let road  = new ClassOptimalRoute.Road();
            road.Crossroad1 = this.indexCrossroad1;
            road.Crossroad2 = i;
            this.roadList.push(road);
            const jsonRoad: string = JSON.stringify(this.roadList);
            console.log(jsonRoad);
        }
        else if (this.isRoadAdd == true) {
            let i = 0;
            while (i < this.crossroadList.length) {
                if (this.crossroadList[i].X == X && this.crossroadList[i].Y == Y) {
                    break;
                }
                i++;
            }

            if (this.crossroadList.length == i) {
                alert("Лох, тут не перекрестка");
                return;
            }

            let j = 0;
            let countIndex = 1;
            while (j < this.roadList.length) {
                if (this.roadList[j].Crossroad1 == i || this.roadList[j].Crossroad2 == i) {
                    countIndex++;
                }
                if (countIndex > 4) {
                    alert("Лох, больше 4 нельзя");
                    return;
                }
                j++;
            }
            this.indexCrossroad1 = i;
        }
    }

    addRoad(): void {
        if (this.crossroadList.length == 60) {
            alert("Больше 60 нельзя");
            return;
        }
        this.isCrossroadAdd = false;
        this.isRoadAdd = true;
        this.indexCrossroad1 = -1;
    }

    replaceSizeGrid(flag: boolean) {
        let tempGridSize = this.gridSize;
        if (!flag && this.gridSize > 30) this.gridSize -= 10;
        else if (flag && this.gridSize < 100) this.gridSize += 10;
        this.gridDrowSize();

        this.drawScaleCanvas(tempGridSize);

    }

    private drawScaleCanvas(tempGridSize: number): void {
        for (let i = 0; i < this.crossroadList.length; i++) {
            this.crossroadList[i].X = Math.round(this.crossroadList[i].X / tempGridSize) * this.gridSize;
            this.crossroadList[i].Y = Math.round(this.crossroadList[i].Y / tempGridSize) * this.gridSize;

            const circle = new Konva.Circle({
                x: this.crossroadList[i].X,
                y: this.crossroadList[i].Y,
                radius: this.gridSize * 2 / 5,
                stroke: '#000',
                full: '#fff',
                //draggable: true, // Включаем перетаскивание
            });
    
            this.layer.add(circle);
    
            // Обновляем слой
            this.layer.draw();
        }

        for (let i = 0; i < this.roadList.length; i++) {
            const line = new Konva.Line({
                points: [
                        this.crossroadList[this.roadList[i].Crossroad1].X, 
                        this.crossroadList[this.roadList[i].Crossroad1].Y, 
                        this.crossroadList[this.roadList[i].Crossroad2].X, 
                        this.crossroadList[this.roadList[i].Crossroad2].Y,  
                        ],
                stroke: '#000',
                strokeWidth: 1,
            })
    
            this.layer.add(line);
    
            // Обновляем слой
            this.layer.draw();
        }
    }

    contextMenu(X: number, Y: number) {
        alert("Тут должно быть контекстное меню!!!" + X + " ," + Y);
    }

    checkLimitRoadForCrossroad() {
        
    }
}
