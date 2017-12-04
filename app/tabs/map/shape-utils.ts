import { Position, Circle } from "nativescript-google-maps-sdk";
import { Color } from "tns-core-modules/color";

import { Sensor } from "../../models/sensor.model";

export function createCircle(sensor: Sensor, size: number): Circle {
    const circle = new Circle();
    circle.center = Position.positionFromLatLng(sensor.latitude, sensor.longitude);
    circle.radius = size;
    circle.fillColor = getColor(sensor.measurements[0].f100);
    circle.userData = sensor;
    circle.clickable = true;

    updateCircle(circle, sensor, false);

    return circle;
}

export function updateCircle(circle: Circle, sensor: Sensor, isSelected: boolean) {
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

export function getColor(value: number): Color {
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

export function getSizeForZoom(zoom: number) {
    // TODO: A more complex logic can be added here
    // 13 -> 200;
    // 12 -> 400;
    // 11 -> 800;

    zoom = Math.min(13, zoom);
    zoom = Math.max(5, zoom);
    Math.floor(zoom);
    return 200 * Math.pow(2, 13 - zoom);
}
