import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Sensor } from "../models/sensor.model";
import "rxjs/Rx";
import { LocalStorageService } from "./local-storage.service";
import { selectedIndexProperty } from "tns-core-modules/ui/tab-view/tab-view";

// const getAllURL = "https://api.luftdaten.info/static/v2/data.dust.min.json";
const getAllUrlLocal =
    "https://api.luftdaten.info/v1/filter/area=42.698334,23.319941,10&type=SDS011";

const singleSensorUrl = "https://api.luftdaten.info/v1/sensor/";

const headers = new Headers({ "Content-Type": "application/json" });

@Injectable()
export class SensorService {
    constructor(private http: Http, private local: LocalStorageService) {}

    getAllDustSensors(): Observable<Sensor[]> {
        return this.http
            .get(getAllUrlLocal, {
                headers
            })
            .map(res => {
                const rawData: Array<any> = res.json();
                // console.log("RAW:");
                // console.dir(rawData);

                const sensors = rawData.map(d => this.parseSensorData(d));
                // console.log("RESULTS:");
                // console.dir(sensors);

                return sensors;
            });
    }

    addFav(sensor: Sensor) {
        this.local.addFav(sensor.id);
        sensor.isFav = true;
    }

    removeFav(sensor: Sensor) {
        this.local.removeFav(sensor.id);
        sensor.isFav = false;
    }

    toggleFav(sensor: Sensor) {
        if (sensor.isFav) {
            this.removeFav(sensor);
        } else {
            this.addFav(sensor);
        }
    }

    getFavs(): Observable<Sensor[]> {
        const sensorIds = this.local.getFavIds();
        console.dir(sensorIds);

        if (sensorIds.length) {
            return Observable.from(sensorIds)
                .map(id => {
                    return this.getSensorByID(id);
                })
                .combineAll();
        } else {
            return Observable.from([]);
        }
    }

    private getSensorByID(id: number): Observable<Sensor> {
        return this.http.get(singleSensorUrl + id, { headers }).map(res => {
            const rawData: Array<any> = res.json();

            const element = rawData.length ? rawData[rawData.length - 1] : null;

            return this.parseSensorData(element);
        });
    }

    private parseSensorData(element: any): Sensor {
        if (!element) {
            return null;
        }

        const p100 = element.sensordatavalues[0]
            ? element.sensordatavalues[0].value
            : NaN;
        const p25 = element.sensordatavalues[1]
            ? element.sensordatavalues[1].value
            : NaN;

        const id = element.sensor.id;
        return new Sensor(
            element.sensor.id,
            element.timestamp,
            element.location.latitude,
            element.location.longitude,
            p100,
            p25,
            this.local.isFav(id)
        );
    }
}
