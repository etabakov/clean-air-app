import {
    Component,
    OnInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    NgZone
} from "@angular/core";
import { Http } from "@angular/http";
import { SensorService } from "../../services/sensor.service";

@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {
    markers: Array<any>;
    markerDetails: string = "test";

    constructor(private sensorService: SensorService,
        private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
    }

    onMapReady(args) {
        this.sensorService
            .getAllDustSensors()
            .do((sensors) => {
                this.markers = new Array<any>();

                for (const sensor of sensors) {
                    this.markers.push({
                        lat: sensor.latitude,
                        lng: sensor.longitude,
                        id: sensor.id,
                        title: sensor.f100.toString(),
                        iconPath: "resources/green.png",
                        onTap: zonedCallback((marker) => {
                            console.log("Zone: " + NgZone.isInAngularZone());
                            console.log("this: " + this);
                            console.log(
                                "id: " +
                                    marker.id +
                                    " p100: " +
                                    marker.title +
                                    this.markerDetails
                            );
                            this.markerDetails =
                                "id: " + marker.id + " p100: " + marker.title;
                            this.cdRef.markForCheck();
                        })
                    });
                }

                args.map.addMarkers(this.markers);
            })
            .subscribe();
    }
}
