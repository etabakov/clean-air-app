import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Sensor } from "../models/sensor.model";

import * as localStorage from "tns-core-modules/application-settings";
import "rxjs/Rx";
import { SensorService } from "./sensor.service";

const SENSORS_KEY = "sensors_key";

function readFromLocalStorage(): number[] {
    return JSON.parse(localStorage.getString(SENSORS_KEY, "[]"));
}

function saveToLocalStorage(sensorIds: number[]) {
    const data = JSON.stringify(sensorIds);
    localStorage.setString(SENSORS_KEY, data);
}

@Injectable()
export class FavoritesService {
    private sensorIds: number[];

    constructor(private sensorService: SensorService) {
        this.sensorIds = readFromLocalStorage();
    }

    getAll(): Observable<Sensor[]> {
        console.dir(this.sensorIds);

        if (this.sensorIds.length) {
            Observable.from(this.sensorIds).flatMap(id =>
                this.sensorService.getSensorByID(id)
            );
        } else {
            return Observable.from([]);
        }
    }

    add(id: number) {
        if (this.sensorIds.indexOf(id) < 0) {
            this.sensorIds.push(id);
            saveToLocalStorage(this.sensorIds);
        }
    }

    remove(id: number) {
        const idx = this.sensorIds.indexOf(id);
        if (idx >= 0) {
            this.sensorIds.splice(idx, 1);
            saveToLocalStorage(this.sensorIds);
        }
    }

    isFavourite(id: number) {
        return this.sensorIds.indexOf(id) >= 0;
    }
}
