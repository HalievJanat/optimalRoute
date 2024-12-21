import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { UDS } from '../../models/UDS.model';
import { Crossroad } from '../../models/UDS.model';
import { Road } from '../../models/UDS.model';
import Konva from 'konva';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
    isLeftPanelOpen = true;
    isRightPanelOpen = true;


    crossroadList: Crossroad[] = [];
    roadList: Road[] = [];
    
    gridSize = 50; // Масштаб
    radius = (this.gridSize * 2) / 5;

    private stage: Konva.Stage = {} as any;
    private layer: Konva.Layer = {} as any;

    //Метод для правой панели
    methodRightPanelOpen(): void {
      this.isRightPanelOpen = !this.isRightPanelOpen;
      /*if (this.isAddUDS) {
        this.gridDrowSize();

        let tempGridSize = this.gridSize;
        this.drawScaleCanvas(tempGridSize);
      }*/
  }

  //Метод для левой панели
  methodLeftPanelOpen(): void {
      this.isLeftPanelOpen = !this.isLeftPanelOpen;
      /*
      if (this.isAddUDS) {
        this.gridDrowSize();

        let tempGridSize = this.gridSize;
        this.drawScaleCanvas(tempGridSize);
      }*/
  }

  addUDS(): void {
    let xhr = this.parseJSON('assets/UDS.json');

    const UDSJSON: UDS = JSON.parse(xhr.responseText);
    this.crossroadList = UDSJSON.crossroads;
    this.roadList = UDSJSON.roads;

    this.gridDrowSize();

    this.drawScaleCanvas(this.gridSize);
  }

  public showOptimalRoute() {
    let xhr = this.parseJSON('assets/UDSOptimal.json');

    const UDSJson: UDS = JSON.parse(xhr.responseText);
    this.crossroadList = UDSJson.crossroads;
    this.roadList = UDSJson.roads;

    this.gridDrowSize();
    this.drawScaleCanvas(this.gridSize);
    console.log(UDSJson);
  }

  public parseJSON(file: string): any {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', file, false);
    xhr.send();
    if(xhr.status != 200) {
        console.log('Ошибка ' + xhr.status + ': ' + xhr.statusText);
    } else {
        console.log(xhr.responseText);
    }
    return xhr;
  }

  public gridDrowSize(): void {
      if (this.isRightPanelOpen == true && this.isLeftPanelOpen == true) {
          this.createStage((window.innerWidth / 100) * 56);
      } else if (
          this.isRightPanelOpen == true ||
          this.isLeftPanelOpen == true
      ) {
          this.createStage((window.innerWidth / 100) * 75);
      } else this.createStage((window.innerWidth / 100) * 94);
  }

  public createStage(wight: number): void {
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

  public drawGrid(): void {
      const width = this.stage.width();
      const height = this.stage.height();

      for (let x = 0; x < width; x += this.gridSize) {
          this.drawLine(x, 0, x, height, '#ddd', -1);
      }
      for (let y = 0; y < height; y += this.gridSize) {
          this.drawLine(0, y, width, y, '#ddd', -1);
      }
  }

  replaceSizeGrid(flag: boolean): void {
      let tempGridSize = this.gridSize;
      if (!flag && this.gridSize > 30) this.gridSize -= 10;
      else if (flag && this.gridSize < 100) this.gridSize += 10;
      else return;
      this.gridDrowSize();

      this.drawScaleCanvas(tempGridSize);
  }

  public drawScaleCanvas(tempGridSize: number): void {
      for (let i = 0; i < this.crossroadList.length; i++) {
          this. radius = (this.gridSize * 2) / 5;
          this.crossroadList[i].x =
              Math.round(this.crossroadList[i].x / tempGridSize) *
              this.gridSize;
          this.crossroadList[i].y =
              Math.round(this.crossroadList[i].y / tempGridSize) *
              this.gridSize;

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
              x1 = this.calculateXCoordinate(ky, by, this.crossroadList[this.roadList[i].crossroad_1].x,
                  this.crossroadList[this.roadList[i].crossroad_1].y, this.radius, 
                  this.crossroadList[this.roadList[i].crossroad_1].x > this.crossroadList[this.roadList[i].crossroad_2].x);
              x2 = this.calculateXCoordinate(ky, by,this.crossroadList[this.roadList[i].crossroad_2].x,
                  this.crossroadList[this.roadList[i].crossroad_2].y, this.radius,
                  this.crossroadList[this.roadList[i].crossroad_1].x < this.crossroadList[this.roadList[i].crossroad_2].x);
              y1 = this.calculateYCoordinate(ky, by, x1);
              y2 = this.calculateYCoordinate(ky, by, x2);
          } else if (this.crossroadList[this.roadList[i].crossroad_1].y > this.crossroadList[this.roadList[i].crossroad_2].y){
              x1 = this.crossroadList[this.roadList[i].crossroad_1].x; 
              x2 = this.crossroadList[this.roadList[i].crossroad_2].x;
              y1 = this.crossroadList[this.roadList[i].crossroad_1].y - this.radius;
              y2 = this.crossroadList[this.roadList[i].crossroad_2].y + this.radius;
          } else {
              x1 = this.crossroadList[this.roadList[i].crossroad_1].x; 
              x2 = this.crossroadList[this.roadList[i].crossroad_2].x;
              y1 = this.crossroadList[this.roadList[i].crossroad_1].y + this.radius;
              y2 = this.crossroadList[this.roadList[i].crossroad_2].y - this.radius
          }

          this.drawLine(
              x1,
              y1,
              x2,
              y2,
              '#000',
              this.roadList[i].direction
          );
      }
  }

  public drawLine(x1: number, y1: number, x2: number, y2: number, stroke: string, direction: number): void {
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
                  pointerAtBeginning: true
              })
          );
      }
          else if (direction == 1) {
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
                  fill: 'black'
              })
          );
      }      
  }

  public calculateKLine(x1: number, y1: number, x2: number, y2: number): number {
      return (y1 - y2)/  (x1 -  x2);
  }

  public calculateBLine(y: number, k: number, x: number): number {
      return y - k * x;
  }

  public calculateXCoordinate(ky:number, by:number, xc:number, yc:number, r:number, flag:boolean): number {
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

  public calculateYCoordinate(k:number, b:number, x:number): number {
      return k*x + b;
  }
}
