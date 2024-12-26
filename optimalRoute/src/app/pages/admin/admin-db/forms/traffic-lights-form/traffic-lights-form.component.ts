import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service.service';
import { allowOnlyDigits, floatValidator, isRequiredError, rangeValidator, stringRangeValidator } from '../validators';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TrafficLights } from '../../../../../models/traffic-light.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-traffic-lights-form',
    standalone: true,
    imports: [NgbDropdownModule, ReactiveFormsModule, NgbPaginationModule],
    templateUrl: './traffic-lights-form.component.html',
    styleUrl: '../forms.scss',
})
export class TrafficLightsFormComponent implements OnInit, AfterViewInit {
    @Input() activeRightElement = 1;
    @Output() activeRightElementChange = new EventEmitter<number>();

    isgetErr = false;

    private fb = inject(FormBuilder);

    httpService = inject(HttpService);

    toastr = inject(ToastrService);

    isTrafficLightEdit = false;

    editTrafficLightNumber = 0;

    pageTrafficLightShowing: TrafficLights[] = [];

    trafficLightsArrSize = 0;

    trafficLightsTabPage = 1;

    trafficLights: TrafficLights[] = [];

    trafficLightAddForm = this.fb.group({
        time_green_signal: [null, [Validators.required, rangeValidator(20, 120)]],
        time_red_signal: [null, [Validators.required, rangeValidator(20, 120)]],
    });

    trafficLightEditForm = this.fb.array<
        FormGroup<{
            time_green_signal: FormControl<number | null>;
            time_red_signal: FormControl<number | null>;
        }>
    >([]);

    constructor() {
        this.httpService.getTrafficLights().subscribe({
            next: trafficLights => {
                this.trafficLights = trafficLights;
                this.trafficLightsArrSize = this.trafficLights.length;
                this.trafficLights.forEach(trafficLight => {
                    const addedTrafficLightGroup = this.fb.nonNullable.group({
                        time_green_signal: [
                            trafficLight.time_green_signal as number | null,
                            [Validators.required, rangeValidator(20, 120)],
                        ],
                        time_red_signal: [trafficLight.time_red_signal as number | null, [Validators.required, rangeValidator(20, 120)]],
                    });
                    addedTrafficLightGroup.disable();

                    this.trafficLightEditForm.push(addedTrafficLightGroup);
                });
            },
            error: _ => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.isgetErr = true;
            },
        });
    }

    //При инициализации компонент отображает именно форму добавления
    ngOnInit(): void {
        this.activeRightElement = 1;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.activeRightElementChange.emit(this.activeRightElement); //чтобы в правой панели визуально текущая кнопка менялась
        }, 150);
    }

    addTrafficLight() {
        if (this.isgetErr) {
            this.trafficLightAddForm.reset();
            this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            return;
        }

        const control = this.trafficLightAddForm.controls;

        const addedTrafficLight = {
            id_traffic_light: this.trafficLights.length ? this.trafficLights[this.trafficLights.length - 1].id_traffic_light + 1 : 0,
            time_green_signal: control.time_green_signal.value as unknown as number,
            time_red_signal: control.time_red_signal.value as unknown as number,
        };

        this.httpService.addMapDbValue<TrafficLights>(addedTrafficLight, 'traffic-light').subscribe({
            next: () => {
                this.trafficLights.push(addedTrafficLight);

                const addedTrafficLightGroup = this.fb.nonNullable.group({
                    time_green_signal: [control.time_green_signal.value as number | null, [Validators.required, rangeValidator(20, 120)]],
                    time_red_signal: [control.time_red_signal.value as number | null, [Validators.required, rangeValidator(20, 120)]],
                });
                addedTrafficLightGroup.disable();

                this.trafficLightEditForm.push(addedTrafficLightGroup);

                this.trafficLightAddForm.reset();

                this.trafficLightsArrSize++;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.trafficLightAddForm.reset();
            },
        });
    }

    editTrafficLights() {
        const control = this.trafficLightEditForm.controls[this.editTrafficLightNumber].controls;

        const id = this.trafficLights[this.editTrafficLightNumber].id_traffic_light;

        const editTrafficLight = {
            id_traffic_light: id,
            time_green_signal: control.time_green_signal.value as number,
            time_red_signal: control.time_red_signal.value as number,
        };

        this.httpService.updateMapDbValue<TrafficLights>(editTrafficLight, 'traffic-light').subscribe({
            next: () => {
                this.trafficLights[this.editTrafficLightNumber] = editTrafficLight;

                this.isTrafficLightEdit = false;
                this.trafficLightEditForm.controls[this.editTrafficLightNumber].disable();
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
                this.cancelEditTrafficLights();
                this.isTrafficLightEdit = false;
                this.trafficLightEditForm.controls[this.editTrafficLightNumber].disable();
            },
        });
    }

    cancelEditTrafficLights() {
        this.trafficLightEditForm.controls[this.editTrafficLightNumber].setValue({
            time_green_signal: this.trafficLights[this.editTrafficLightNumber].time_green_signal,
            time_red_signal: this.trafficLights[this.editTrafficLightNumber].time_red_signal,
        });

        this.isTrafficLightEdit = false;
        this.trafficLightEditForm.controls[this.editTrafficLightNumber].disable();
    }

    trafficLightDelete(index: number) {
        this.httpService.deleteMapDbValue(this.trafficLights[index], 'traffic-light').subscribe({
            next: () => {
                this.trafficLights.splice(index, 1);
                this.trafficLightEditForm.controls.splice(index, 1);
                this.trafficLightsArrSize--;
            },
            error: () => {
                this.toastr.error('Не удалость подключиться к серверу', 'Ошибка');
            },
        });
    }

    trafficLightDuplicateValidation(
        formGroup: FormGroup<{
            time_green_signal: FormControl<number | null>;
            time_red_signal: FormControl<number | null>;
        }>,
        editIndex?: number
    ) {
        let hasDuplicate = false;

        this.trafficLights.forEach((trafficLight, index) => {
            if (editIndex === undefined || editIndex !== index) {
                if (
                    formGroup.controls.time_green_signal.value === trafficLight.time_green_signal &&
                    formGroup.controls.time_red_signal.value === trafficLight.time_red_signal
                ) {
                    hasDuplicate = true;
                    return;
                }
            }
        });

        return hasDuplicate;
    }

    //Шаблон не видит импортируемые функции
    isRequiredTrafficLightError(form: FormGroup) {
        return isRequiredError(form);
    }

    allowOnlyDigitsTrafficLight(event: KeyboardEvent): void {
        allowOnlyDigits(event);
    }
}
