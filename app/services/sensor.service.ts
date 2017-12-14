import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Sensor, Measurement } from "../models/sensor.model";
import { LocalStorageService } from "./local-storage.service";
import { selectedIndexProperty } from "tns-core-modules/ui/tab-view/tab-view";
import { Store } from "@ngrx/store";
import { AppState } from "../store/reducers";
import { Add, Remove } from "../store/reducers/favourites";

// const getAllURL = "https://api.luftdaten.info/static/v2/data.dust.min.json";
const getAllUrlLocal =
    "https://api.luftdaten.info/v1/filter/area=42.698334,23.319941,4&type=SDS011";

const singleSensorUrl = "https://api.luftdaten.info/v1/sensor/";

const headers = new Headers({ "Content-Type": "application/json" });

@Injectable()
export class SensorService {
    constructor(private http: Http, private store: Store<AppState>) {}

    getSensorsInArea(
        lon: number,
        lat: number,
        zoom: number
    ): Observable<Sensor[]> {
        const radius = 40000 / Math.pow(2, zoom);
        const url = `https://api.luftdaten.info/v1/filter/area=${lon},${lat},${
            radius
        }&type=SDS011`;
        console.log("url: " + url);
        return this.getSensorData(url);
    }

    getAllDustSensors(): Observable<Sensor[]> {
        return this.getSensorData(getAllUrlLocal);
    }

    getSensorData(url: string): Observable<Sensor[]> {
        return this.http
            .get(url, {
                headers
            })
            .combineLatest(this.store.select(s => s.favs.favIds))
            .map(([res, favs]) => {
                const rawData: Array<any> = res.json();
                console.log("DATA: " + rawData.length);

                // console.log("RAW:");
                // console.dir(rawData);

                const sensorMap = new Map<string, Sensor>();

                const sensors = rawData.forEach(d =>
                    this.parseSensorData(d, sensorMap)
                );

                const result = Array.from(sensorMap.values());
                // console.log("RESULTS: " + result.length);

                // const favs = this.local.getFavIds();
                // const favs = this.store.select(s => s.favs.favIds).
                result.forEach(s => {
                    s.isFav = favs.indexOf(s.id) >= 0;
                });

                return result;
            });
    }

    toggleFav(sensor: Sensor) {
        if (sensor.isFav) {
            // this.local.removeFav(sensor.id);
            this.store.dispatch(new Remove(sensor.id));
            sensor.isFav = false;
        } else {
            // this.local.addFav(sensor.id);
            this.store.dispatch(new Add(sensor.id));
            sensor.isFav = true;
        }
    }

    // getFavs(): Observable<Sensor[]> {
    //     // const sensorIds = this.local.getFavIds();
    //     // console.dir(sensorIds);

    //     // if (sensorIds.length) {
    //     //     return Observable.from(this.store.select(s=>s.favs.favIds).last()
    //     //         .map(id => {
    //     //             return this.getSensorByID(id).do(s => (s.isFav = true));
    //     //         })
    //     //         .combineAll();
    //     // } else {
    //     //     return Observable.from([]);
    //     // }
    //     this.store.last().
    // }

    private getSensorByID(id: number): Observable<Sensor> {
        return this.http.get(singleSensorUrl + id, { headers }).map(res => {
            const rawData: Array<any> = res.json();

            if (rawData.length) {
                return this.parseSensorData(
                    rawData[rawData.length - 1],
                    new Map<string, Sensor>()
                );
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

    private parseSensorData(
        element: any,
        sensorMap: Map<string, Sensor>
    ): Sensor {
        if (!element) {
            return null;
        }

        const f100 = element.sensordatavalues[0]
            ? element.sensordatavalues[0].value
            : NaN;
        const f25 = element.sensordatavalues[1]
            ? element.sensordatavalues[1].value
            : NaN;

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
