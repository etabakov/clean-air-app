import { MetaReducer } from "@ngrx/store";

import { Favourites, favsReducer } from "./favourites";
import { Sensors, sensorsReducer } from "./sensors";
import { Viewport, viewportReducer } from "./viewport";

import { logger } from "./logger";

export interface AppState {
    favs: Favourites;
    sensors: Sensors;
    viewport: Viewport;
}

export const reducers = {
    favs: favsReducer,
    sensors: sensorsReducer,
    viewport: viewportReducer
};

export const metaReducers: MetaReducer<any>[] = [logger];
