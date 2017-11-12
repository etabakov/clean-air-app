import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { SensorService } from "../../services/sensor.service";

@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html"
})
export class MapComponent implements OnInit {
    private markers : Array<any>;

    constructor(private sensorService: SensorService) {
    }

    ngOnInit(): void {
        this.sensorService.getAllDustSensors()
                            .do(sensors => {
                                for(var sensor of sensors) {
                                    this.markers.push({
                                        lat: sensor.latitude,
                                        lng: sensor.longitude,
                                        id: sensor.id,
                                        title: sensor.f100
                                    });
                                }
                            }).subscribe();
    }

    onMapReady(args) {
        args.map.addMarkers(this.markers);
    }
}
