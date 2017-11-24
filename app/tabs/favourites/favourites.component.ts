import { Component, OnInit } from "@angular/core";
import { FavouritesService } from "../../services/favourites.service";
import { Sensor } from "../../models/sensor.model";
import { Observable } from "rxjs/Observable";

@Component({
    selector: "Favourites",
    templateUrl: "favourites.component.html",
    moduleId: module.id
})
export class FavouritesComponent implements OnInit {
    sensors$: Observable<Sensor[]>;
    constructor(public favService: FavouritesService) {
        console.log("FavouritesComponent constructor");
    }

    ngOnInit() {
        this.sensors$ = this.favService.getAll();
    }
}
