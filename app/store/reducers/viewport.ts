import { Action } from "@ngrx/store";

export const VIEWPORT_SET = "[Viewport] Set";

export class SetViewport implements Action {
    readonly type = VIEWPORT_SET;
    constructor(public payload: Viewport) {}
}

export interface Viewport {
    latitude: number;
    longitude: number;
    zoom: number;
}

export const initialState: Viewport = {
    latitude: 42.698334,
    longitude: 23.319941,
    zoom: 13
};

export type All = SetViewport;

export function viewportReducer(state: Viewport = initialState, action: All) {
    switch (action.type) {
        case VIEWPORT_SET:
            return action.payload;
    }
    return state;
}
