import { Injectable } from "@angular/core";
import { Sensor } from "../models/sensor.model";
import * as appSettings from "tns-core-modules/application-settings";

const SENSORS_KEY = "sensors_key";

function readFromLocalStorage(): number[] {
    return JSON.parse(appSettings.getString(SENSORS_KEY, "[]"));
}

function saveToLocalStorage(sensorIds: number[]) {
    const data = JSON.stringify(sensorIds);
    console.log("saving: " + data);
    appSettings.setString(SENSORS_KEY, data);
}

@Injectable()
export class LocalStorageService {
    private sensorIds: number[];

    constructor() {
        this.sensorIds = readFromLocalStorage();
    }

    addFav(id: number) {
        if (this.sensorIds.indexOf(id) < 0) {
            this.sensorIds.push(id);
            saveToLocalStorage(this.sensorIds);
        }
    }

    removeFav(id: number) {
        const idx = this.sensorIds.indexOf(id);
        if (idx >= 0) {
            this.sensorIds.splice(idx, 1);
            saveToLocalStorage(this.sensorIds);
        }
    }

    isFav(id: number): boolean {
        return this.sensorIds.indexOf(id) >= 0;
    }

    getFavIds(): number[] {
        return this.sensorIds.slice();
    }
}
