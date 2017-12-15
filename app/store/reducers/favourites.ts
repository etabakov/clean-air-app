import { Action } from "@ngrx/store";

export const FAV_ADD = "[Fav] Add Favourite";
export const FAV_REMOVE = "[Fav] Remove Favourite";
export const FAV_SET = "[Fav] Set Favourite";

export class AddFav implements Action {
    readonly type = FAV_ADD;
    constructor(public payload: number) {}
}

export class RemoveFav implements Action {
    readonly type = FAV_REMOVE;
    constructor(public payload: number) {}
}

export class SetFav implements Action {
    readonly type = FAV_SET;
    constructor(public payload: number[]) {}
}

export interface Favourites {
    favIds: number[];
}

export const initialState: Favourites = {
    favIds: []
};

export type All = AddFav | RemoveFav | SetFav;

export function favsReducer(state: Favourites = initialState, action: All) {
    switch (action.type) {
        case FAV_ADD:
            if (state.favIds.indexOf(action.payload) < 0) {
                const favIds = state.favIds.concat([action.payload]);
                return { favIds };
            }
        case FAV_REMOVE:
            const idx = state.favIds.indexOf(action.payload);
            if (idx >= 0) {
                const favIds = [...state.favIds.splice(0, idx), ...state.favIds.splice(idx + 1)];
                return { favIds };
            }
        case FAV_SET:
            return { favIds: action.payload };
    }
    return state;
}
