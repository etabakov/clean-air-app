import {
    Component,
    OnInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    NgZone
} from "@angular/core";
import { Http } from "@angular/http";
import { SensorService } from "../../services/sensor.service";
import { FavouritesService } from "../../services/favourites.service";
import { Sensor } from "../../models/sensor.model";

@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {
    markers: Array<any>;
    selectedSensor: Sensor;

    constructor(
        private sensorService: SensorService,
        private favService: FavouritesService,
        private cdRef: ChangeDetectorRef
    ) {}

    onMapReady(args) {
        this.sensorService
            .getAllDustSensors()
            .do(sensors => {
                this.markers = new Array<any>();

                for (const sensor of sensors) {
                    this.markers.push({
                        sensor,
                        lat: sensor.latitude,
                        lng: sensor.longitude,
                        id: sensor.id,
                        title: sensor.f100.toString(),
                        iconPath: "resources/green.png",
                        onTap: zonedCallback(marker => {
                            this.selectedSensor = marker.sensor;
                            this.cdRef.markForCheck();
                        })
                    });
                }

                args.map.addMarkers(this.markers);
            })
            .subscribe();
    }

    toggleFavourite(sensor: Sensor) {
        if (this.favService.isFavourite(sensor.id)) {
            this.favService.remove(sensor.id);
        } else {
            this.favService.add(sensor.id);
        }
    }
}
