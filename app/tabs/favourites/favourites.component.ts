import { Component, OnInit } from "@angular/core";
import { Sensor } from "../../models/sensor.model";
import { Observable } from "rxjs/Observable";
import { SensorService } from "../../services/sensor.service";

@Component({
    selector: "Favourites",
    templateUrl: "favourites.component.html",
    moduleId: module.id
})
export class FavouritesComponent implements OnInit {
    sensors$: Observable<Sensor[]>;
    constructor(public sensorService: SensorService) {
        console.log("FavouritesComponent constructor");
    }

    ngOnInit() {
        this.sensors$ = this.sensorService.getFavs();
    }
    
    toggleFav(sensor: Sensor) {
        this.sensorService.toggleFav(sensor);
    }
}
