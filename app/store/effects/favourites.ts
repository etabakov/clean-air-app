import { Injectable } from "@angular/core";
import { Action, INIT, Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { Actions, Effect, ROOT_EFFECTS_INIT } from "@ngrx/effects";
import { defer } from "rxjs/observable/defer";
import * as appSettings from "tns-core-modules/application-settings";

import { SetFav, FAV_ADD, FAV_REMOVE, FAV_SET } from "../reducers/favourites";
import { AppState } from "../reducers";

const SENSORS_KEY = "sensors_key";

function readFromLocalStorage(): number[] {
    return JSON.parse(appSettings.getString(SENSORS_KEY, "[]"));
}

function saveToLocalStorage(sensorIds: number[]) {
    const data = JSON.stringify(sensorIds);
    console.log("saving: " + data);
    appSettings.setString(SENSORS_KEY, data);
}

@Injectable()
export class FavouritesEffects {
    // Init the state from reading the app settings
    @Effect()
    init$: Observable<Action> = this.actions$.ofType(ROOT_EFFECTS_INIT).map(() => {
        const favs = readFromLocalStorage();
        console.log("ROOT_EFFECTS_INIT favourites: " + favs);
        return new SetFav(favs);
    });

    @Effect({ dispatch: false })
    save$ = this.actions$
        .ofType(FAV_ADD, FAV_REMOVE, FAV_SET)
        .withLatestFrom(this.store$.select(s => s.favs.favIds))
        .do(([action, favIds]) => {
            saveToLocalStorage(favIds);
        });

    constructor(private actions$: Actions, private store$: Store<AppState>) {}
}
