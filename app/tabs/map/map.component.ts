import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { Http } from "@angular/http";
import { SensorService } from "../../services/sensor.service";

@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush 
})
export class MapComponent implements OnInit {
    private markers : Array<any>;
    private markerDetails: string = "test";

    constructor(private sensorService: SensorService) {
    }

    ngOnInit(): void {
        const that = this;
        this.sensorService.getAllDustSensors()
                            .do(sensors => {
                                this.markers = new Array<any>();

                                for(var sensor of sensors) {
                                    this.markers.push({
                                        lat: sensor.latitude,
                                        lng: sensor.longitude,
                                        id: sensor.id,
                                        title: sensor.f100.toString(),
                                        iconPath: "resources/green.png",
                                        onTap: function(marker) {
                                            console.log("id: " + marker.id + " p100: " + marker.title + that.markerDetails);
                                            that.markerDetails = "id: " + marker.id + " p100: " + marker.title;
                                        }
                                    });
                                }
                            }).subscribe();
    }

    onMapReady(args) {
        args.map.addMarkers(this.markers);
    }
}
