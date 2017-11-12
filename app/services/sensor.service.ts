import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Sensor } from "../models/sensor.model";
import 'rxjs/Rx';

@Injectable()
export class SensorService {
    constructor(private http: Http) {}

    getAllDustSensors() : Observable<Sensor[]> {
        return this.http.get("http://api.luftdaten.info/static/v2/data.dust.min.json")
                    .map(res => res.json())
                    .map(json => {
                        const sensors = Array<Sensor>();

                        json.Result.forEach(element => {
                            sensors.push(new Sensor(element.id, element.timestamp, element.location.latitude, element.location.longitude, 0, 0));
                        });

                        return sensors;
                    })
    }
}