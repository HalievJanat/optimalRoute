import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
import { ModalInputComponent } from '../../modals/modal-input/modal-input/modal-input.component';
import { ToastrService } from 'ngx-toastr';
import { ModalSelectingComponent } from '../../modals/modal-selecting/modal-selecting/modal-selecting.component';
import { Router } from '@angular/router';
import { ModalSavingConfirmComponent } from '../../modals/modal-saving-confirm/modal-saving-confirm/modal-saving-confirm.component';
import { ModalDeleteConfirmComponent } from '../../modals/modal-delete-confirm/modal-delete-confirm.component';
import { ModalDevelopersComponent } from '../../modals/modal-developers/modal-developers/modal-developers.component';

@Component({
    selector: 'app-admin-page',
    standalone: true,
    imports: [HeaderComponent, CommonModule, NgbDropdownModule, ReactiveFormsModule],
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {
    httpService = inject(HttpService);

    @ViewChild('createNewMap', { static: true }) createNewMapTag!: ElementRef<HTMLAnchorElement>;

    UDSList: UDS[] = [];
    trafficLights: TrafficLights[] = [];
    streets: Street[] = [];
    coverTypes: TypeCover[] = [];
    corruptionDegrees: DegreeCorruption[] = [];

    currentUDS: UDS | null = null;

    constructor(config: NgbModalConfig, private modalService: NgbModal, private toastr: ToastrService, private router: Router) {
        // customize default values of modals used by this component tree
        config.backdrop = 'static';
        config.keyboard = false;

        this.httpService.getUDSList().subscribe({
            next: udsList => {
                this.UDSList = udsList;
            },
            error: () => {
                //TODO router.navigateByUrl('error-page');
            },
        });
        this.httpService.getTrafficLights().subscribe({
            next: trafficLights => {
                this.trafficLights = trafficLights;
            },
            error: () => {
                //TODO router.navigateByUrl('error-page');
            },
        });
        this.httpService.getStreets().subscribe({
            next: streets => {
                this.streets = streets;
            },
            error: () => {
                //TODO router.navigateByUrl('error-page');
            },
        });
        this.httpService.getTypeCovers().subscribe({
            next: coverTypes => {
                this.coverTypes = coverTypes;
            },
            error: () => {
                //TODO router.navigateByUrl('error-page');
            },
        });
        this.httpService.getDegreeCorruptions().subscribe({
            next: corruptionDegrees => {
                this.corruptionDegrees = corruptionDegrees;
            },
            error: () => {
                //TODO router.navigateByUrl('error-page');
            },
        });
    }

    openDevelopersModal() {
        this.modalService.open(ModalDevelopersComponent, {
            centered: true,
        });
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
    isMoveCrossroad = false;

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

    road!: Road;

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
        this.isMoveCrossroad = false;
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
        this.isMoveCrossroad = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        this.isContextMenuVisibleCrossroad = false;
        this.isContextMenuVisibleRoad = false;
        this.indexCrossroad1 = -1;
        if (this.crossroadList.length > 30) {
            this.toastr.warning('Не может быть более 30 прогонов', 'Предупреждение');
            return;
        }
        this.isCrossroadAdd = true;
        this.isRoadAdd = false;
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
        this.isContextMenuVisibleRoad = false; // Показывать ли меню
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

        if (this.isMoveCrossroad) {
            this.isMoveCrossroad = false;
            if (!this.checkIntersectionRoad(X, Y)) {
                this.toastr.warning('Не удаётся переместить перекресток', 'Предупреждение');
                return;
            }

            for (let i = 0; i < this.crossroadList.length; i++) {
                if (X === this.crossroadList[i].x && Y === this.crossroadList[i].y) {
                    this.toastr.warning('Не удаётся переместить перекресток', 'Предупреждение');
                    return;
                }
            }

            for (let j = 0; j < this.roadList.length; j++) {
                let crossroad_1 = this.roadList[j].crossroad_1;
                let crossroad_2 = this.roadList[j].crossroad_2;

                let x1 = this.crossroadList[crossroad_1].x;
                let y1 = this.crossroadList[crossroad_1].y;
                let x2 = this.crossroadList[crossroad_2].x;
                let y2 = this.crossroadList[crossroad_2].y;

                if (crossroad_1 === this.indexSelectedElement) {
                    let ky = this.calculateKLine(X, Y, this.crossroadList[crossroad_2].x, this.crossroadList[crossroad_2].y);
                    let by = this.calculateBLine(Y, ky, X);

                    this.crossroadList[this.indexSelectedElement].x = X;
                    this.crossroadList[this.indexSelectedElement].y = Y;

                    if (!this.checkIntersectionCrossroad(ky, by, this.indexSelectedElement, crossroad_2)) {
                        this.toastr.warning('Не удаётся переместить перекресток', 'Предупреждение');
                        this.crossroadList[this.indexSelectedElement].x = x1;
                        this.crossroadList[this.indexSelectedElement].y = y1;
                        return;
                    }
                } else if (crossroad_2 === this.indexSelectedElement) {
                    let ky = this.calculateKLine(this.crossroadList[crossroad_1].x, this.crossroadList[crossroad_1].y, X, Y);
                    let by = this.calculateBLine(Y, ky, X);

                    this.crossroadList[this.indexSelectedElement].x = X;
                    this.crossroadList[this.indexSelectedElement].y = Y;

                    if (!this.checkIntersectionCrossroad(ky, by, crossroad_1, this.indexSelectedElement)) {
                        this.toastr.warning('Не удаётся переместить перекресток', 'Предупреждение');
                        this.crossroadList[this.indexSelectedElement].x = x2;
                        this.crossroadList[this.indexSelectedElement].y = y2;
                        return;
                    }
                }
            }
            
            this.crossroadList[this.indexSelectedElement].x = X;
            this.crossroadList[this.indexSelectedElement].y = Y;
            this.gridDrowSize();
            this.drawScaleCanvas(this.gridSize);
            return;
        }

        if (this.isCrossroadAdd == true) {
            this.isCrossroadAdd = false;
            for (let i = 0; i < this.crossroadList.length; i++) {
                if (this.crossroadList[i].x == X && this.crossroadList[i].y == Y) {
                    this.toastr.warning('Не удаётся установить перекресток', 'Предупреждение');
                    return;
                }
            }

            if (!this.checkIntersectionRoad(X, Y)) {
                this.toastr.warning('Не удаётся установить перекресток', 'Предупреждение');
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

            let crossroad: Crossroad = {
                id_crossroad: this.crossroadList.length,
                id_uds: this.currentUDS ? this.currentUDS.id_uds : -1,
                x: X,
                y: Y,
                traffic_light: null,
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
                this.toastr.warning('Перекресток не найден', 'Предупреждение');
                return;
            } else if (i == this.indexCrossroad1) {
                this.toastr.warning('Прогон нельзя добавить к данным объектам', 'Предупреждение');
                return;
            }

            let j = 0;
            let countIndex = 1;
            while (j < this.roadList.length) {
                if (this.roadList[j].crossroad_1 == i || this.roadList[j].crossroad_2 == i) {
                    countIndex++;
                }
                if (countIndex > 4) {
                    this.toastr.warning('Не может быть более 4 прогонов', 'Предупреждение');
                    return;
                }
                j++;
            }

            for (let y = 0; y < this.roadList.length; y++) {
                if (
                    (this.roadList[y].crossroad_1 == this.indexCrossroad1 && this.roadList[y].crossroad_2 == i) ||
                    (this.roadList[y].crossroad_2 == this.indexCrossroad1 && this.roadList[y].crossroad_1 == i)
                ) {
                    this.toastr.warning('Не удаётся добавить прогон', 'Предупреждение');
                    this.isRoadAdd = false;
                    return;
                }
            }

            let ky = this.calculateKLine(this.crossroadList[this.indexCrossroad1].x, this.crossroadList[this.indexCrossroad1].y, X, Y);
            let by = this.calculateBLine(this.crossroadList[this.indexCrossroad1].y, ky, this.crossroadList[this.indexCrossroad1].x);

            if (!this.checkIntersectionCrossroad(ky, by, this.indexCrossroad1, i)) {
                this.toastr.warning('Не удаётся установить прогон', 'Предупреждение');
                return;
            }

            this.rightPanelHeaderText = 'Ввод начальных значений прогона';

            this.isLeftClickRoad = true;

            this.road = {
                crossroad_1: this.indexCrossroad1,
                crossroad_2: i,
                street: { id_street: 0, name: '' },
                traffic_signs: null,
                police_post: null,
                type_cover: { id_type_cover: 0, name: '', coefficient_braking: 1 },
                direction: 1,
                length: 1,
            };
        } else if (this.isRoadAdd == true) {
            let i = 0;
            while (i < this.crossroadList.length) {
                if (this.crossroadList[i].x == X && this.crossroadList[i].y == Y) {
                    break;
                }
                i++;
            }

            if (this.crossroadList.length == i) {
                this.toastr.warning('Перекресток не найден', 'Предупреждение');
                return;
            }

            let j = 0;
            let countIndex = 1;
            while (j < this.roadList.length) {
                if (this.roadList[j].crossroad_1 == i || this.roadList[j].crossroad_2 == i) {
                    countIndex++;
                }
                if (countIndex > 4) {
                    this.toastr.warning('Нельзя добавить более 4 прогонов', 'Предупреждение');
                    return;
                }
                j++;
            }
            this.indexCrossroad1 = i;
        }
        this.indexSelectedElement = -1;
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
        this.isMoveCrossroad = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        if (this.defineClickCrossroad(X, Y)) {
            this.rightPanelHeaderText = 'Параметры перекрёстка';
            const crossroad = this.crossroadList[this.indexSelectedElement].traffic_light;
            if (crossroad) {
                this.dropdownGreenDuration = crossroad.time_green_signal.toString();
                this.dropdownRedDuration = crossroad.time_red_signal.toString();
            }
            this.isLeftClickCrossroad = true;
        } else if (this.defineClickRoad(X, Y)) {
            this.rightPanelHeaderText = 'Параметры прогона';
            const road = this.roadList[this.indexSelectedElement];

            this.roadLength.setValue(road.length);

            this.dropdownMoveDirection = road.direction.toString();

            this.dropdownStreet = road.street.name;

            this.dropdownCoverType = road.type_cover.name;

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
        this.isMoveCrossroad = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        this.isContextMenuVisibleCrossroad = false;
        this.isContextMenuVisibleRoad = false;
        this.indexCrossroad1 = -1;
        if (this.roadList.length > 60) {
            this.toastr.warning('Не может быть более 60 прогонов', 'Предупреждение');
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
        this.isMoveCrossroad = false;
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
        this.isMoveCrossroad = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;
        this.indexSelectedElement = -1;
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
        this.isMoveCrossroad = false;
        this.rightPanelHeaderText = 'Добавить светофор';

        this.closeContextMenu();
    }

    actionMoveCrossroad(): void {
        this.isMoveCrossroad = true;
        this.rightPanelHeaderText = 'Перемещение перекрестка';

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
        this.isMoveCrossroad = false;
        this.isAddPolicePost = false;
        this.isAddTrafficSigns = false;

        this.crossroadList[this.indexSelectedElement].traffic_light = null;
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
        this.isMoveCrossroad = false;
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
        this.isMoveCrossroad = false;
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
        this.crossroadList[this.indexSelectedElement].traffic_light!.time_green_signal = Number(this.dropdownGreenDuration);
        this.crossroadList[this.indexSelectedElement].traffic_light!.time_red_signal = Number(this.dropdownRedDuration);

        this.crossroadList[this.indexSelectedElement].traffic_light!.id_traffic_light = this.findTrafficLightIndex();

        const jsonCrossroad: string = JSON.stringify(this.crossroadList);
        console.log(jsonCrossroad);

        this.rightPanelHeaderText = 'Параметры элементов УДС';
        this.dropdownGreenDuration = '';
        this.dropdownRedDuration = '';
        this.isAddTrafficLights = false;
        this.isMoveCrossroad = false;
        this.isLeftClickCrossroad = false;
        this.isLeftClickRoad = false;
    }

    modifyRoadParamener(): void {
        if (this.isRoadAdd) {
            let x = this.crossroadList[this.road.crossroad_1].x;
            let y = this.crossroadList[this.road.crossroad_1].y;
            let X = this.crossroadList[this.road.crossroad_2].x;
            let Y = this.crossroadList[this.road.crossroad_2].y;

            let ky = this.calculateKLine(x, y, X, Y);
            let by = this.calculateBLine(y, ky, x);

            let x1;
            let x2;
            let y1;
            let y2;

            if (ky != Infinity && ky != -Infinity) {
                x1 = this.calculateXCoordinate(ky, by, x, y, this.radius, x > X);
                x2 = this.calculateXCoordinate(ky, by, X, Y, this.radius, x < X);
                y1 = this.calculateYCoordinate(ky, by, x1);
                y2 = this.calculateYCoordinate(ky, by, x2);
            } else if (y > Y) {
                x1 = x;
                x2 = X;
                y1 = y - this.radius;
                y2 = Y + this.radius;
            } else {
                x1 = x;
                x2 = X;
                y1 = y + this.radius;
                y2 = Y - this.radius;
            }

            this.drawLine(x1, y1, x2, y2, '#000', this.road.direction);

            this.isRoadAdd = false;

            this.roadList.push(this.road);
            const jsonRoad: string = JSON.stringify(this.roadList);
            console.log(jsonRoad);
            this.indexCrossroad1 = -1;
            this.indexSelectedElement = this.roadList.length - 1;
            this.isRoadAdd = false;
        }

        console.log(this.indexSelectedElement);
        this.roadList[this.indexSelectedElement].direction = Number(this.dropdownMoveDirection);

        this.roadList[this.indexSelectedElement].street.name = this.dropdownStreet;

        this.roadList[this.indexSelectedElement].street.id_street = this.streets.find(
            street => street.name === this.dropdownStreet
        )!.id_street;

        this.roadList[this.indexSelectedElement].length = this.roadLength.value as number;

        this.roadList[this.indexSelectedElement].type_cover.name = this.dropdownCoverType;

        this.roadList[this.indexSelectedElement].type_cover.id_type_cover = this.coverTypes.find(
            coverType => coverType.name === this.dropdownCoverType
        )!.id_type_cover;

        if (this.roadList[this.indexSelectedElement].traffic_signs !== null) {
            this.roadList[this.indexSelectedElement].traffic_signs!.id_traffic_sign = this.findTrafficSignIndex();
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
        this.isMoveCrossroad = false;
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
        this.crossroadList[this.indexSelectedElement].traffic_light = {
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
        this.isMoveCrossroad = false;
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
            id_traffic_sign: this.findTrafficSignIndex(),
            speed: Number(this.dropdownTrafficSign),
        };

        const jsonRoad: string = JSON.stringify(this.roadList);
        console.log(jsonRoad);

        this.isAddTrafficSigns = false;
        this.dropdownTrafficSign = '';
    }

    saveUDS(): void {
        if (this.crossroadList.length < 2 || this.roadList.length < 1) {
            this.toastr.warning('Для сохранения необходимы минимум 2 перекрестка и 1 прогон', 'Предупреждение');
            return;
        }

        for (let i = 0; i < this.crossroadList.length; i++) {
            this.crossroadList[i].x = Math.round(this.crossroadList[i].x / this.gridSize) * 50;
            this.crossroadList[i].y = Math.round(this.crossroadList[i].y / this.gridSize) * 50;
        }

        if (this.currentUDS) {
            let uds: UDS = {
                id_uds: this.currentUDS.id_uds,
                name: this.currentUDS.name,
                crossroads: this.crossroadList,
                roads: this.roadList,
                route: null,
            };

            this.httpService.deleteUDS(uds).subscribe({
                next: () => {
                    this.httpService.sendUDS(uds).subscribe({
                        next: () => {
                            this.httpService.getUDSList().subscribe({
                                next: udsList => {
                                    this.UDSList = udsList;
                                    const lastAddedUDS = udsList.reduce((max, current) => (current.id_uds > max.id_uds ? current : max));
                                    this.currentUDS = lastAddedUDS;
                                    this.toastr.success('Карта сохранена', 'Сохранение');
                                },
                                error: () => {
                                    this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                                },
                            });
                        },
                        error: () => {
                            this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                        },
                    });
                },
                error: () => {
                    this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                },
            });
        } else {
            const modalRef = this.modalService.open(ModalInputComponent, {
                centered: true,
            });
            this.UDSList.forEach(uds => {
                modalRef.componentInstance.existingNames.push(uds.name);
            });

            modalRef.result
                .then(name => {
                    let uds: UDS = {
                        id_uds: this.UDSList.length ? this.UDSList[this.UDSList.length - 1].id_uds : 0,
                        name: name,
                        crossroads: this.crossroadList,
                        roads: this.roadList,
                        route: null,
                    };
                    console.log(name);

                    this.httpService.sendUDS(uds).subscribe({
                        next: () => {
                            this.httpService.getUDSList().subscribe({
                                next: udsList => {
                                    this.UDSList = udsList;
                                    const lastAddedUDS = udsList.reduce((max, current) => (current.id_uds > max.id_uds ? current : max));
                                    this.currentUDS = lastAddedUDS;
                                    this.toastr.success('Карта сохранена', 'Сохранение');
                                },
                            });
                        },
                        error: () => {
                            this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                        },
                    });
                })
                .catch(() => {});
        }
    }

    openUDS(): void {
        const modalRef = this.modalService.open(ModalSelectingComponent, {
            centered: true,
        });
        this.UDSList.forEach(uds => {
            modalRef.componentInstance.mapList.push(uds.name);
        });

        modalRef.result
            .then(index => {
                this.currentUDS = this.UDSList[index];
                this.crossroadList = this.currentUDS.crossroads;
                this.roadList = this.currentUDS.roads;
                this.gridSize = 50;

                this.gridDrowSize();
                this.drawScaleCanvas(this.gridSize);
            })
            .catch(() => {});
    }

    findTrafficLightIndex() {
        return this.trafficLights.find(
            trafficLight =>
                trafficLight.time_green_signal === Number(this.dropdownGreenDuration) &&
                trafficLight.time_red_signal === Number(this.dropdownRedDuration)
        )!.id_traffic_light;
    }

    findTrafficSignIndex() {
        let index = -1;
        switch (this.dropdownTrafficSign) {
            case '30':
                index = 0;
                break;
            case '40':
                index = 1;
                break;
            case '50':
                index = 2;
                break;
        }
        return index;
    }

    findPolicePostIndex() {
        return this.corruptionDegrees.find(corruptionDegree => corruptionDegree.name === this.dropdownCorruptionCoef)!.id_corruption;
    }

    openDbPage() {
        this.openConfirmModal('admin-page/db');
    }

    openSystemPage() {
        this.openConfirmModal('system-page');
    }

    openConfirmModal(nextPageUrl: string) {
        console.log(this.roadList.length);
        if (this.crossroadList.length < 2 || !this.roadList.length) {
            this.router.navigateByUrl(nextPageUrl);
            return;
        }

        const modalRef = this.modalService.open(ModalSavingConfirmComponent, {
            centered: true,
        });

        modalRef.result
            .then(() => {
                this.saveUDS();
                this.router.navigateByUrl(nextPageUrl);
            })
            .catch(() => {
                this.router.navigateByUrl(nextPageUrl);
            });
    }

    deleteUDS() {
        let uds: UDS = {
            id_uds: this.currentUDS!.id_uds,
            name: this.currentUDS!.name,
            crossroads: this.crossroadList,
            roads: this.roadList,
            route: null,
        };

        const modalRef = this.modalService.open(ModalDeleteConfirmComponent, {
            centered: true,
        });
        modalRef.componentInstance.deletedObj = this.currentUDS?.name;

        modalRef.result
            .then(() => {
                this.httpService.deleteUDS(uds).subscribe({
                    next: () => {
                        this.toastr.success('Карта успешно удалена', 'Удаление');

                        this.createNewMapTag.nativeElement.click();
                    },
                    error: () => {
                        this.toastr.error('Не удалось подключиться к серверу', 'Ошибка');
                    },
                });
            })
            .catch(() => {});
    }
}
