import {
    Component,
    OnInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    NgZone
} from "@angular/core";
import { Http } from "@angular/http";
import { SensorService } from "../../services/sensor.service";
import { Sensor } from "../../models/sensor.model";

import {
    MapView,
    Marker,
    Position,
    Circle,
    Shape,
    ShapeEventData
} from "nativescript-google-maps-sdk";
import { Color } from "tns-core-modules/color";
import { colorProperty } from "tns-core-modules/ui/frame/frame";

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

    constructor(
        private sensorService: SensorService,
        private cdRef: ChangeDetectorRef
    ) {}

    onMapReady(event) {
        console.log("Map Ready");

        if (this.mapView === event.object) {
            return;
        }

        this.mapView = event.object;

        console.log("Setting a marker...");
        this.sensorService
            .getAllDustSensors()
            .do(sensors => {
                for (const sensor of sensors) {
                    const circle = this.createCircle(sensor);

                    this.mapView.addCircle(circle);
                }
            })
            .subscribe();
    }

    private createCircle(sensor: Sensor): Circle {
        const circle = new Circle();
        circle.center = Position.positionFromLatLng(
            sensor.latitude,
            sensor.longitude
        );
        circle.radius = 100;
        circle.strokeWidth = 0;

        circle.fillColor = this.getColor(sensor.measurements[0].f100);
        circle.clickable = true;
        circle.userData = sensor;
        return circle;
    }

    private getColor(value: number): Color {
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

    onCoordinateTapped(args) {
        console.log(
            "Coordinate Tapped, Lat: " +
                args.position.latitude +
                ", Lon: " +
                args.position.longitude,
            args
        );
    }

    onShapeSelect(args: ShapeEventData) {
        this.selectedSensor = args.shape.userData;
    }

    toggleFav(sensor: Sensor) {
        this.sensorService.toggleFav(sensor);
    }

    onCameraChanged(args) {
        console.log(
            "Camera changed: " + JSON.stringify(args.camera),
            JSON.stringify(args.camera) === this.lastCamera
        );
        this.lastCamera = JSON.stringify(args.camera);
    }
}
