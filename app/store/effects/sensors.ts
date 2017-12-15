import { Injectable } from "@angular/core";
import { Action, INIT, Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { Actions, Effect } from "@ngrx/effects";
import { defer } from "rxjs/observable/defer";
import { AppState } from "../reducers";
import { VIEWPORT_SET, SetViewport } from "../reducers/viewport";
import { SetSensors } from "../reducers/sensors";
import { Http, Headers } from "@angular/http";
import { Sensor, Measurement } from "../../models/sensor.model";

const getAllUrlLocal = "https://api.luftdaten.info/v1/filter/area=42.698334,23.319941,4&type=SDS011";

const singleSensorUrl = "https://api.luftdaten.info/v1/sensor/";

const headers = new Headers({ "Content-Type": "application/json" });

@Injectable()
export class SensorsEffects {
    @Effect()
    update$: Observable<Action> = this.actions$.ofType(VIEWPORT_SET).switchMap((action: SetViewport) => {
        console.log("EFFECT: VIEWPORT_SET");
        const radius = 40000 / Math.pow(2, action.payload.zoom);
        const lat = action.payload.latitude;
        const lon = action.payload.longitude;
        const url = `https://api.luftdaten.info/v1/filter/area=${lat},${lon},${radius}&type=SDS011`;

        console.log("Sensors get: " + url);
        return this.getSensorData(url).map(sensors => new SetSensors(sensors));
    });

    getSensorData(url: string): Observable<Sensor[]> {
        return this.http
            .get(url, { headers })
            .combineLatest(this.store$.select(s => s.favs.favIds))
            .map(([res, favs]) => {
                const rawData: Array<any> = res.json();
                const sensorMap = new Map<string, Sensor>();
                const sensors = rawData.forEach(d => parseSensorData(d, sensorMap));

                const result = Array.from(sensorMap.values());

                result.forEach(s => {
                    s.isFav = favs.indexOf(s.id) >= 0;
                });

                console.log("Sensors retrieved: " + result.length);

                return result;
            });
    }

    constructor(private actions$: Actions, private store$: Store<AppState>, private http: Http) {}
}

function parseSensorData(element: any, sensorMap: Map<string, Sensor>): Sensor {
    if (!element) {
        return null;
    }

    const f100 = element.sensordatavalues[0] ? element.sensordatavalues[0].value : NaN;
    const f25 = element.sensordatavalues[1] ? element.sensordatavalues[1].value : NaN;

    const measurement: Measurement = {
        f100,
        f25,
        timestamp: element.timestamp
    };

    const id = element.sensor.id;
    let sensor: Sensor = sensorMap.get(id);
    if (!sensor) {
        sensor = {
            id,
            latitude: parseFloat(element.location.latitude),
            longitude: parseFloat(element.location.longitude),
            measurements: []
        };
        sensorMap.set(id, sensor);
    }

    sensor.measurements.push(measurement);
    // console.dir(sensor);
    return sensor;
}
