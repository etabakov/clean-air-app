import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Sensor } from "../models/sensor.model";
import 'rxjs/Rx';

@Injectable()
export class SensorService {
    constructor(private http: Http) {}

    getAllDustSensors() : Observable<Sensor[]> {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        return this.http.get("http://api.luftdaten.info/static/v2/data.dust.min.json", { headers: headers })
                    .map(res => {
                        const sensors = Array<Sensor>();

                        res.json().forEach(element => {
                            const p100 = element.sensordatavalues[0].value;
                            const p25 = element.sensordatavalues[1].value;

                            sensors.push(new Sensor(
                                element.id, 
                                element.timestamp, 
                                element.location.latitude, 
                                element.location.longitude, 
                                p100, 
                                p25));
                        });

                        return sensors;
                    })
    }
}