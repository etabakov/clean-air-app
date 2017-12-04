import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from "@angular/core";
import { Http } from "@angular/http";
import { SensorService } from "../../services/sensor.service";
import { Sensor } from "../../models/sensor.model";

import { MapView, Marker, Position, Circle, Shape, ShapeEventData } from "nativescript-google-maps-sdk";
import { Color } from "tns-core-modules/color";
import { colorProperty } from "tns-core-modules/ui/frame/frame";

function createCircle(sensor: Sensor): Circle {
    const circle = new Circle();
    circle.center = Position.positionFromLatLng(sensor.latitude, sensor.longitude);
    circle.radius = 100;
    circle.fillColor = getColor(sensor.measurements[0].f100);
    circle.userData = sensor;
    circle.clickable = true;

    updateCircle(circle, sensor, false);

    return circle;
}

function updateCircle(circle: Circle, sensor: Sensor, isSelected: boolean) {
    if (isSelected) {
        circle.strokeWidth = 5;
        circle.strokeColor = new Color("gray");
    } else if (sensor.isFav) {
        circle.strokeWidth = 5;
        circle.strokeColor = new Color("orange");
    } else {
        circle.strokeWidth = 0;
    }
}

function getColor(value: number): Color {
    if (value < 35) {
        return new Color("#4400AA00");
    } else if (value < 50) {
        return new Color("#44999900");
    } else if (value < 50) {
        return new Color("#44990000");
    } else {
        return new Color("#44FF2222");
    }
}

@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {
    mapView: MapView;
    lastCamera: string;
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

    onCoordinateTapped(args) {
        console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
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

    onCameraChanged(args) {
        console.log("Camera changed: " + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
        this.lastCamera = JSON.stringify(args.camera);

        this.sensorService
            .getSensorsInArea(args.camera.latitude, args.camera.longitude, args.camera.zoom)
            .do(sensors => {
                this.mapView.removeAllShapes();
                const selectedId = this.selectedSensor ? this.selectedSensor.id : -1;
                sensors.map(createCircle).forEach(circle => {
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
