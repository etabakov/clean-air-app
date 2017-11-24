import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Sensor } from "../../models/sensor.model";

@Component({
    selector: "sensor-details",
    templateUrl: "sensor-details.component.html",
    moduleId: module.id
})
export class SensorDetailsComponent {
    @Input() sensor: Sensor;
    @Output() toggle: EventEmitter<Sensor> = new EventEmitter<Sensor>();
}
