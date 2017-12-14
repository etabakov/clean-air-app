import { MetaReducer } from "@ngrx/store";
import { Favourites, favsReducer } from "./favourites";
import { logger } from "./logger";

export interface AppState {
    favs: Favourites;
}

export const reducers = {
    favs: favsReducer
};

export const metaReducers: MetaReducer<any>[] = [logger];
