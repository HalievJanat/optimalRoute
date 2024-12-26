import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import Konva from 'konva';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../services/http-service.service';
import { TrafficLights } from '../../models/traffic-light.model';
import { Street } from '../../models/street.model';
import { TypeCover } from '../../models/cover-type.model';
import { DegreeCorruption } from '../../models/police-post.model';
import { Crossroad, Road, UDS } from '../../models/UDS.model';

@Component({
    selector: 'app-admin-page',
    standalone: true,
    imports: [HeaderComponent, CommonModule, NgbDropdownModule, ReactiveFormsModule],
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {
    httpService = inject(HttpService);

    trafficLights: TrafficLights[] = [];
    streets: Street[] = [];
    coverTypes: TypeCover[] = [];
    corruptionDegrees: DegreeCorruption[] = [];

    constructor(config: NgbModalConfig, private modalService: NgbModal) {
        // customize default values of modals used by this component tree
        config.backdrop = 'static';
        config.keyboard = false;

        this.httpService.getTrafficLights().subscribe(trafficLights => {
            this.trafficLights = trafficLights;
        });
        this.httpService.getStreets().subscribe(streets => {
            this.streets = streets;
        });
        this.httpService.getTypeCovers().subscribe(coverTypes => {
            this.coverTypes = coverTypes;
        });
        this.httpService.getDegreeCorruptions().subscribe(corruptionDegrees => {
            this.corruptionDegrees = corruptionDegrees;
        });
    }

    open(content: any) {
        this.modalService.open(content);
    }

    dropdownGreenDuration = '';
    dropdownRedDuration = '';
    dropdownMoveDirection = '';
    dropdownStreet = '';
    roadLength: FormControl<number | null> = new FormControl(null);
    dropdownCoverType = '';
    dropdownTrafficSign = '';
    dropdownCorruptionCoef = '';

    isContextMenuVisibleCrossroad = false; // Показывать ли меню
    isContextMenuVisibleRoad = false; // Показывать ли меню
    contextMenuPosition = { x: 0, y: 0 }; // Координаты меню
    indexSelectedElement = -1;

    rightPanelHeaderText = 'Параметры элементов УДС';

    isLeftClickCrossroad = false;
    isLeftClickRoad = false;

    isAddTrafficLights = false;
    isAddPolicePost = false;
    isAddTrafficSigns = false;

    [x: string]: any;
    isLeftPanelOpen = true;
    isRightPanelOpen = true;
    crossroadList: Crossroad[] = [];
    roadList: Road[] = [];

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
        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';

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
        } else if (this.isRightPanelOpen == true || this.isLeftPanelOpen == true) {
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
        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
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
        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
        this.isContextMenuVisibleCrossroad = false; // Показывать ли меню
        this.isContextMenuVisibleRoad = false; // Показывать ли
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
                if (this.crossroadList[i].x == X && this.crossroadList[i].y == Y) {
                    alert('Здесь нельзя установить перекресток');
                    return;
                }
            }

            if (!this.checkIntersectionRoad(X, Y)) {
                alert('Здесь нельзя установить перекресток');
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

            let crossroad = {
                x: X,
                y: Y,
                trafficLights: null,
            };
            this.crossroadList.push(crossroad);
            const jsonCrossroad: string = JSON.stringify(this.crossroadList);
            console.log(jsonCrossroad);
        } else if (this.isRoadAdd == true && this.indexCrossroad1 >= 0) {
            let i = 0;
            while (i < this.crossroadList.length) {
                if (this.crossroadList[i].x == X && this.crossroadList[i].y == Y) {
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
                if (this.roadList[j].crossroad_1 == i || this.roadList[j].crossroad_2 == i) {
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
                    (this.roadList[y].crossroad_1 == this.indexCrossroad1 && this.roadList[y].crossroad_2 == i) ||
                    (this.roadList[y].crossroad_2 == this.indexCrossroad1 && this.roadList[y].crossroad_1 == i)
                ) {
                    alert('Нельзя добавить прогон!!!');
                    this.isRoadAdd = false;
                    return;
                }
            }

            //this.isLeftClickRoad = true;

            let ky = this.calculateKLine(this.crossroadList[this.indexCrossroad1].x, this.crossroadList[this.indexCrossroad1].y, X, Y);
            let by = this.calculateBLine(this.crossroadList[this.indexCrossroad1].y, ky, this.crossroadList[this.indexCrossroad1].x);

            if (!this.checkIntersectionCrossroad(ky, by, this.indexCrossroad1, i)) {
                alert('Здесь нельзя установить прогон');
                return;
            }
            let x1;
            let x2;
            let y1;
            let y2;

            if (ky != Infinity && ky != -Infinity) {
                x1 = this.calculateXCoordinate(
                    ky,
                    by,
                    this.crossroadList[this.indexCrossroad1].x,
                    this.crossroadList[this.indexCrossroad1].y,
                    this.radius,
                    this.crossroadList[this.indexCrossroad1].x > X
                );
                x2 = this.calculateXCoordinate(ky, by, X, Y, this.radius, this.crossroadList[this.indexCrossroad1].x < X);
                y1 = this.calculateYCoordinate(ky, by, x1);
                y2 = this.calculateYCoordinate(ky, by, x2);
            } else if (this.crossroadList[this.indexCrossroad1].y > Y) {
                x1 = this.crossroadList[this.indexCrossroad1].x;
                x2 = X;
                y1 = this.crossroadList[this.indexCrossroad1].y - this.radius;
                y2 = Y + this.radius;
            } else {
                x1 = this.crossroadList[this.indexCrossroad1].x;
                x2 = X;
                y1 = this.crossroadList[this.indexCrossroad1].y + this.radius;
                y2 = Y - this.radius;
            }

            let road: Road = {
                crossroad_1: this.indexCrossroad1,
                crossroad_2: i,
                street: { id_street: 0, name: '' },
                traffic_signs: null,
                police_post: null,
                typeCover: { id_type_cover: 0, name: '', coefficient_braking: 1 },
                direction: 1,
                length: 1,
            };
            this.drawLine(x1, y1, x2, y2, '#000', road.direction);

            this.isRoadAdd = false;

            this.roadList.push(road);
            const jsonRoad: string = JSON.stringify(this.roadList);
            console.log(jsonRoad);
            this.indexCrossroad1 = -1;
        } else if (this.isRoadAdd == true) {
            let i = 0;
            while (i < this.crossroadList.length) {
                if (this.crossroadList[i].x == X && this.crossroadList[i].y == Y) {
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
                if (this.roadList[j].crossroad_1 == i || this.roadList[j].crossroad_2 == i) {
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

    checkIntersectionCrossroad(ky: number, by: number, crossroad1: number, crossroad2: number): boolean {
        let x1 = this.crossroadList[crossroad1].x;
        let y1 = this.crossroadList[crossroad1].y;
        let x2 = this.crossroadList[crossroad2].x;
        let y2 = this.crossroadList[crossroad2].y;

        if (x1 < x2) {
            x1 = this.crossroadList[crossroad2].x;
            x2 = this.crossroadList[crossroad1].x;
        }
        if (y1 < y2) {
            y1 = this.crossroadList[crossroad2].y;
            y2 = this.crossroadList[crossroad1].y;
        }

        for (let i = 0; i < this.crossroadList.length; i++) {
            if (i == crossroad1 || i == crossroad2) continue;
            let x = this.crossroadList[i].x;
            let y = this.crossroadList[i].y;
            if (x > x1 || x < x2 || y > y1 || y < y2) continue;
            if (ky != Infinity && ky != -Infinity) {
                if (this.calculateXCoordinate(ky, by, x, y, this.radius, true) != -1000) return false;
            } else if (x == x1) {
                return false;
            }
        }
        return true;
    }

    checkIntersectionRoad(x: number, y: number): boolean {
        for (let i = 0; i < this.roadList.length; i++) {
            let x1 = this.crossroadList[this.roadList[i].crossroad_1].x;
            let x2 = this.crossroadList[this.roadList[i].crossroad_2].x;
            let y1 = this.crossroadList[this.roadList[i].crossroad_1].y;
            let y2 = this.crossroadList[this.roadList[i].crossroad_2].y;

            let ky = this.calculateKLine(x1, y1, x2, y2);
            let by = this.calculateBLine(y1, ky, x1);

            if (x1 < x2) {
                x1 = x2;
                x2 = this.crossroadList[this.roadList[i].crossroad_1].x;
            }
            if (y1 < y2) {
                y1 = y2;
                y2 = this.crossroadList[this.roadList[i].crossroad_1].y;
            }

            if (x > x1 || x < x2 || y > y1 || y < y2) continue;

            if (ky != Infinity && ky != -Infinity) {
                if (this.calculateXCoordinate(ky, by, x, y, this.radius, true) != -1000) return false;
            } else if (x == x1) {
                return false;
            }
        }
        return true;
    }

    evenDoubleClickConvas(X: number, Y: number): void {
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
        this.isCrossroadAdd = false;
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        if (this.defineClickCrossroad(X, Y)) {
            this.rightPanelHeaderText = 'Параметры перекрёстка';
            const crossroad = this.crossroadList[this.indexSelectedElement].trafficLights;
            if (crossroad) {
                this.dropdownGreenDuration = crossroad.time_green_signal.toString();
                this.dropdownRedDuration = crossroad.time_red_signal.toString();
            }
            this.isLeftClickCrossroad = true;
        } else if (this.defineClickRoad(X, Y)) {
            this.rightPanelHeaderText = 'Параметры прогона';
            const road = this.roadList[this.indexSelectedElement];
            if (road.length) {
                this.roadLength.setValue(road.length);
            }
            if (road.direction) {
                this.dropdownMoveDirection = road.direction.toString();
            }
            if (road.street) {
                this.dropdownStreet = road.street.name;
            }
            if (road.typeCover) {
                this.dropdownCoverType = road.typeCover.name;
            }
            if (road.traffic_signs) {
                this.dropdownTrafficSign = road.traffic_signs.speed.toString();
            }
            if (road.police_post) {
                this.dropdownCorruptionCoef = road.police_post.corruption.name;
            }
            this.isLeftClickRoad = true;
        }
    }

    addRoad(): void {
        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
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
        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
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
            this.radius = (this.gridSize * 2) / 5;
            this.crossroadList[i].x = Math.round(this.crossroadList[i].x / tempGridSize) * this.gridSize;
            this.crossroadList[i].y = Math.round(this.crossroadList[i].y / tempGridSize) * this.gridSize;

            const circle = new Konva.Circle({
                x: this.crossroadList[i].x,
                y: this.crossroadList[i].y,
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
                this.crossroadList[this.roadList[i].crossroad_1].x,
                this.crossroadList[this.roadList[i].crossroad_1].y,
                this.crossroadList[this.roadList[i].crossroad_2].x,
                this.crossroadList[this.roadList[i].crossroad_2].y
            );
            let by = this.calculateBLine(
                this.crossroadList[this.roadList[i].crossroad_1].y,
                ky,
                this.crossroadList[this.roadList[i].crossroad_1].x
            );
            let x1;
            let x2;
            let y1;
            let y2;

            if (ky != Infinity && ky != -Infinity) {
                x1 = this.calculateXCoordinate(
                    ky,
                    by,
                    this.crossroadList[this.roadList[i].crossroad_1].x,
                    this.crossroadList[this.roadList[i].crossroad_1].y,
                    this.radius,
                    this.crossroadList[this.roadList[i].crossroad_1].x > this.crossroadList[this.roadList[i].crossroad_2].x
                );
                x2 = this.calculateXCoordinate(
                    ky,
                    by,
                    this.crossroadList[this.roadList[i].crossroad_2].x,
                    this.crossroadList[this.roadList[i].crossroad_2].y,
                    this.radius,
                    this.crossroadList[this.roadList[i].crossroad_1].x < this.crossroadList[this.roadList[i].crossroad_2].x
                );
                y1 = this.calculateYCoordinate(ky, by, x1);
                y2 = this.calculateYCoordinate(ky, by, x2);
            } else if (this.crossroadList[this.roadList[i].crossroad_1].y > this.crossroadList[this.roadList[i].crossroad_2].y) {
                x1 = this.crossroadList[this.roadList[i].crossroad_1].x;
                x2 = this.crossroadList[this.roadList[i].crossroad_2].x;
                y1 = this.crossroadList[this.roadList[i].crossroad_1].y - this.radius;
                y2 = this.crossroadList[this.roadList[i].crossroad_2].y + this.radius;
            } else {
                x1 = this.crossroadList[this.roadList[i].crossroad_1].x;
                x2 = this.crossroadList[this.roadList[i].crossroad_2].x;
                y1 = this.crossroadList[this.roadList[i].crossroad_1].y + this.radius;
                y2 = this.crossroadList[this.roadList[i].crossroad_2].y - this.radius;
            }

            this.drawLine(x1, y1, x2, y2, '#000', this.roadList[i].direction);
        }
    }

    private drawLine(x1: number, y1: number, x2: number, y2: number, stroke: string, direction: number): void {
        if (direction == -1) {
            this.layer.add(
                new Konva.Line({
                    points: [x1, y1, x2, y2],
                    stroke: stroke,
                    strokeWidth: 1,
                })
            );
        } else if (direction == 0) {
            this.layer.add(
                new Konva.Arrow({
                    points: [x1, y1, x2, y2],
                    stroke: stroke,
                    strokeWidth: 1,
                    fill: 'black',
                    pointerAtBeginning: true,
                })
            );
        } else if (direction == 1) {
            this.layer.add(
                new Konva.Arrow({
                    points: [x1, y1, x2, y2],
                    stroke: stroke,
                    strokeWidth: 1,
                    fill: 'black',
                })
            );
        } else if (direction == 2) {
            this.layer.add(
                new Konva.Arrow({
                    points: [x2, y2, x1, y1],
                    stroke: stroke,
                    strokeWidth: 1,
                    fill: 'black',
                })
            );
        }
    }

    private calculateKLine(x1: number, y1: number, x2: number, y2: number): number {
        return (y1 - y2) / (x1 - x2);
    }

    private calculateBLine(y: number, k: number, x: number): number {
        return y - k * x;
    }

    private calculateXCoordinate(ky: number, by: number, xc: number, yc: number, r: number, flag: boolean): number {
        let a = 1 + Math.pow(ky, 2);
        let b = 2 * ky * by - 2 * ky * yc - 2 * xc;
        let c = Math.pow(xc, 2) + Math.pow(yc, 2) - Math.pow(r, 2) + Math.pow(by, 2) - 2 * by * yc;

        let d = Math.pow(b, 2) - 4 * a * c;
        if (d < 0) return -1000;
        let x;

        if (flag) x = (-b - Math.sqrt(d)) / (2 * a);
        else x = (-b + Math.sqrt(d)) / (2 * a);

        return x;
    }

    private calculateYCoordinate(k: number, b: number, x: number): number {
        return k * x + b;
    }

    openContextMenu(event: MouseEvent): void {
        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
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
        while (i < this.roadList.length) {
            if (this.roadList[i].crossroad_1 > this.indexSelectedElement) {
                this.roadList[i].crossroad_1 -= 1;
            } else if (this.roadList[i].crossroad_1 == this.indexSelectedElement) {
                this.roadList.splice(i, 1);
                continue;
            }
            if (this.roadList[i].crossroad_2 > this.indexSelectedElement) {
                this.roadList[i].crossroad_2 -= 1;
            } else if (this.roadList[i].crossroad_2 == this.indexSelectedElement) {
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
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
        this.isAddTrafficLights = true;
        this.rightPanelHeaderText = 'Добавить светофор';

        this.closeContextMenu();
    }

    actionDeleteTrafficLights(): void {
        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;

        this.crossroadList[this.indexSelectedElement].trafficLights = null;
        this.closeContextMenu();
    }

    actionAddTrafficSigns(): void {
        this.isAddTrafficSigns = true;
        this.rightPanelHeaderText = 'Добавить знак дорожного движения';

        this.closeContextMenu();
    }

    actionDeleteTrafficSigns(): void {
        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;

        this.roadList[this.indexSelectedElement].traffic_signs = null;
        this.closeContextMenu();
    }

    actionAddPolicePost(): void {
        this.isAddPolicePost = true;
        this.rightPanelHeaderText = 'Добавить полицейский пост';

        this.closeContextMenu();
    }

    actionDeletePolicePost(): void {
        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
        this.isAddTrafficLights = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;

        this.roadList[this.indexSelectedElement].police_post = null;
        this.closeContextMenu();
    }

    private defineClickCrossroad(x: number, y: number): boolean {
        for (let i = 0; i < this.crossroadList.length; i++) {
            let x0 = this.crossroadList[i].x;
            let y0 = this.crossroadList[i].y;
            let r = Math.pow(x - x0, 2) + Math.pow(y - y0, 2);
            if (r <= Math.pow(this.radius, 2)) {
                this.indexSelectedElement = i;
                return true;
            }
        }
        return false;
    }

    private defineClickRoad(x: number, y: number): boolean {
        for (let i = 0; i < this.roadList.length; i++) {
            let k = this.calculateKLine(
                this.crossroadList[this.roadList[i].crossroad_1].x,
                this.crossroadList[this.roadList[i].crossroad_1].y,
                this.crossroadList[this.roadList[i].crossroad_2].x,
                this.crossroadList[this.roadList[i].crossroad_2].y
            );
            let b = this.calculateBLine(
                this.crossroadList[this.roadList[i].crossroad_1].y,
                k,
                this.crossroadList[this.roadList[i].crossroad_1].x
            );

            if (k == Infinity || k == -Infinity) {
                let x1 = this.crossroadList[this.roadList[i].crossroad_1].x;
                let yMax = this.crossroadList[this.roadList[i].crossroad_1].y;
                let yMin = this.crossroadList[this.roadList[i].crossroad_2].y;
                if (yMax < yMin) {
                    yMax = this.crossroadList[this.roadList[i].crossroad_2].y;
                    yMin = this.crossroadList[this.roadList[i].crossroad_1].y;
                }

                if (x > x1 - 6 && x < x1 + 6 && y > yMin && y < yMax) {
                    this.indexSelectedElement = i;
                    return true;
                }
            } else {
                for (let j = 0; j < 6; j++) {
                    let y1 = Math.round(k * x + b + j);
                    let y2 = Math.round(k * x + b - j);
                    if (y === y1 || y === y2) {
                        this.indexSelectedElement = i;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    modifyCrossroadParamener(): void {
        this.crossroadList[this.indexSelectedElement].trafficLights!.time_green_signal = Number(this.dropdownGreenDuration);
        this.crossroadList[this.indexSelectedElement].trafficLights!.time_red_signal = Number(this.dropdownRedDuration);

        this.crossroadList[this.indexSelectedElement].trafficLights!.id_traffic_light = this.findTrafficLightIndex();

        const jsonCrossroad: string = JSON.stringify(this.crossroadList);
        console.log(jsonCrossroad);

        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.isAddTrafficLights = false;
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
    }

    modifyRoadParamener(): void {
        this.roadList[this.indexSelectedElement].direction = Number(this.dropdownMoveDirection);

        this.roadList[this.indexSelectedElement].street.id_street = this.streets.find(
            street => street.name === this.dropdownStreet
        )!.id_street;
        this.roadList[this.indexSelectedElement].street.name = this.dropdownStreet;

        this.roadList[this.indexSelectedElement].length = this.roadLength.value as number;

        this.roadList[this.indexSelectedElement].typeCover.id_type_cover = this.coverTypes.find(
            coverType => coverType.name === this.dropdownCoverType
        )!.id_type_cover;
        this.roadList[this.indexSelectedElement].typeCover.name = this.dropdownCoverType;

        if (this.roadList[this.indexSelectedElement].traffic_signs !== null) {
            this.roadList[this.indexSelectedElement].traffic_signs!.speed = Number(this.dropdownTrafficSign);
        }

        if (this.roadList[this.indexSelectedElement].police_post !== null) {
            this.roadList[this.indexSelectedElement].police_post!.corruption.id_corruption = this.findPolicePostIndex();
            this.roadList[this.indexSelectedElement].police_post!.corruption.name = this.dropdownCorruptionCoef;
        }

        const jsonRoad: string = JSON.stringify(this.roadList);
        console.log(jsonRoad);

        this.gridDrowSize();
        this.drawScaleCanvas(this.gridSize);

        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;

        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
    }

    setDropdownTrafficLight(trafficLightIndex: number) {
        this.dropdownGreenDuration = this.trafficLights[trafficLightIndex].time_green_signal.toString();
        this.dropdownRedDuration = this.trafficLights[trafficLightIndex].time_red_signal.toString();
    }

    setDropdownStreet(streetIndex: number) {
        this.dropdownStreet = this.streets[streetIndex].name;
    }

    setDropdownCoverType(coverTypeIndex: number) {
        this.dropdownCoverType = this.coverTypes[coverTypeIndex].name;
    }

    setDropdownCorruptionCoef(corruptionCoef: number) {
        this.dropdownCorruptionCoef = this.corruptionDegrees[corruptionCoef].name;
    }

    setDropdownMoveDirectionValue(value: string) {
        this.dropdownMoveDirection = value;
    }

    setDropdownTrafficSignValue(value: string) {
        this.dropdownTrafficSign = value;
    }

    cancelAdding() {
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
        this.isAddTrafficLights = false;
        this.rightPanelHeaderText = 'Параметры элементов УДС';

        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.dropdownMoveDirection = '';
        this.dropdownStreet = '';
        this.roadLength.setValue(null);
        this.dropdownCoverType = '';
        this.dropdownTrafficSign = '';
        this.dropdownCorruptionCoef = '';
    }

    addTrafficLights(): void {
        this.crossroadList[this.indexSelectedElement].trafficLights = {
            id_traffic_light: this.findTrafficLightIndex(),
            time_green_signal: Number(this.dropdownRedDuration),
            time_red_signal: Number(this.dropdownGreenDuration),
        };

        this.dropdownRedDuration = '';
        this.dropdownGreenDuration = '';

        const jsonCrossroad: string = JSON.stringify(this.crossroadList);
        console.log(jsonCrossroad);

        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.isAddTrafficLights = false;
    }

    addPolicePost(): void {
        this.roadList[this.indexSelectedElement].police_post = {
            corruption: {
                id_corruption: this.findPolicePostIndex(),
                name: this.dropdownCorruptionCoef,
                coefficient_corruption: 1,
            },
        };

        const jsonRoad: string = JSON.stringify(this.roadList);
        console.log(jsonRoad);

        this.isAddPolicePost = false;
        this.dropdownCorruptionCoef = '';
    }

    addTrafficSigns(): void {
        this.roadList[this.indexSelectedElement].traffic_signs = {
            id_traffic_sign: 0,
            speed: Number(this.dropdownTrafficSign),
        };

        const jsonRoad: string = JSON.stringify(this.roadList);
        console.log(jsonRoad);

        this.isAddTrafficSigns = false;
        this.dropdownTrafficSign = '';
    }

    saveUDS(): void {
        if (this.crossroadList.length < 2 || this.roadList.length < 1) {
            alert('Ошибка, нельзя сохранить карту');
            return;
        }
        let uds: UDS = {
            id_uds: 0,
            name: 'Samara',
            crossroads: this.crossroadList,
            roads: this.roadList,
            route: null,
        };
        const jsonUDS: string = JSON.stringify(uds);
        console.log(jsonUDS);
    }

    findTrafficLightIndex() {
        return this.trafficLights.find(
            trafficLight =>
                trafficLight.time_green_signal === Number(this.dropdownGreenDuration) &&
                trafficLight.time_red_signal === Number(this.dropdownRedDuration)
        )!.id_traffic_light;
    }


    //TODO хз есть ли в бд
    // findTrafficSignIndex() {


    //     switch(this.dropdownTrafficSign) {
    //         case '30':
    //             return 1;
    //         case '40':
    //             return 2;
    //         case '50':
    //             return 3;
    //     }
    // }

    findPolicePostIndex() {
        return this.corruptionDegrees.find(
            corruptionDegree =>
                corruptionDegree.name === this.dropdownCorruptionCoef
        )!.id_corruption;
    }
}
