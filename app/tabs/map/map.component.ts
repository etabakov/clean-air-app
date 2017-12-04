import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from "@angular/core";
import { Http } from "@angular/http";
import { MapView, Circle, ShapeEventData, CameraEventData } from "nativescript-google-maps-sdk";
import { Color } from "tns-core-modules/color";

import { createCircle, updateCircle, getSizeForZoom } from "./shape-utils";
import { SensorService } from "../../services/sensor.service";
import { Sensor } from "../../models/sensor.model";

@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {
    mapView: MapView;
    selectedSensor: Sensor;
    selectedShape: Circle;

    constructor(private sensorService: SensorService, private cdRef: ChangeDetectorRef) {}

    onMapReady(event) {
        console.log("Map Ready");

        if (this.mapView === event.object) {
            return;
        }

        this.mapView = event.object;
    }

    onShapeSelect(args: ShapeEventData) {
        if (this.selectedShape && this.selectedSensor) {
            updateCircle(this.selectedShape, this.selectedSensor, false);
        }

        this.selectedShape = <Circle>args.shape;
        this.selectedSensor = args.shape.userData;

        if (this.selectedShape && this.selectedSensor) {
            updateCircle(this.selectedShape, this.selectedSensor, true);
        }
    }

    toggleFav(sensor: Sensor) {
        this.sensorService.toggleFav(sensor);
        if (this.selectedShape && this.selectedSensor) {
            updateCircle(this.selectedShape, this.selectedSensor, true);
        }
    }

    onCameraChanged(args: CameraEventData) {
        console.log("Camera changed: " + JSON.stringify(args.camera));

        const size = getSizeForZoom(args.camera.zoom);
        this.sensorService
            .getSensorsInArea(args.camera.latitude, args.camera.longitude, args.camera.zoom)
            .do(sensors => {
                this.mapView.removeAllShapes();
                const selectedId = this.selectedSensor ? this.selectedSensor.id : -1;
                sensors.map(s => createCircle(s, size)).forEach(circle => {
                    this.mapView.addCircle(circle);
                    if (circle.userData.id === selectedId) {
                        this.selectedShape = circle;
                        updateCircle(circle, circle.userData, true);
                    }
                });
            })
            .subscribe();
    }
}
