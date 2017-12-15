import { Action } from "@ngrx/store";
import { Sensor } from "../../models/sensor.model";

export const SENSORS_SET = "[SENSOR] Set";

export class SetSensors implements Action {
    readonly type = SENSORS_SET;
    constructor(public payload: Sensor[]) {}
}

export interface Sensors {
    sensors: Sensor[];
}

export const initialState: Sensors = {
    sensors: []
};

export type All = SetSensors;

export function sensorsReducer(state: Sensors = initialState, action: All) {
    switch (action.type) {
        case SENSORS_SET:
            return { sensors: action.payload };
    }
    return state;
}
