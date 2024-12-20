import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
    isAddUDS = false;
    isLeftPanelOpen = true;
    isRightPanelOpen = true;

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

  addUDS() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/UDS.json', false);
    xhr.send();
    if(xhr.status != 200) {
        console.log('Ошибка ' + xhr.status + ': ' + xhr.statusText);
    } else {
        console.log(xhr.responseText);
    }
  }
}
