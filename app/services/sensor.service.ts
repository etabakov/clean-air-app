import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Sensor, Measurement } from "../models/sensor.model";
import { selectedIndexProperty } from "tns-core-modules/ui/tab-view/tab-view";
import { Store } from "@ngrx/store";
import { AppState } from "../store/reducers";
import { AddFav, RemoveFav } from "../store/reducers/favourites";

// const getAllURL = "https://api.luftdaten.info/static/v2/data.dust.min.json";
const getAllUrlLocal = "https://api.luftdaten.info/v1/filter/area=42.698334,23.319941,4&type=SDS011";

const singleSensorUrl = "https://api.luftdaten.info/v1/sensor/";

const headers = new Headers({ "Content-Type": "application/json" });

@Injectable()
export class SensorService {
    constructor(private http: Http, private store: Store<AppState>) {}

    toggleFav(sensor: Sensor) {
        if (sensor.isFav) {
            this.store.dispatch(new RemoveFav(sensor.id));
            sensor.isFav = false;
        } else {
            this.store.dispatch(new AddFav(sensor.id));
            sensor.isFav = true;
        }
    }

    private getSensorByID(id: number): Observable<Sensor> {
        return this.http.get(singleSensorUrl + id, { headers }).map(res => {
            const rawData: Array<any> = res.json();

            if (rawData.length) {
                return this.parseSensorData(rawData[rawData.length - 1], new Map<string, Sensor>());
            } else {
                return {
                    id,
                    latitude: NaN,
                    longitude: NaN,
                    measurements: []
                };
            }
        });
    }

    private parseSensorData(element: any, sensorMap: Map<string, Sensor>): Sensor {
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
}
