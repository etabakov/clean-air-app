import { ActionReducer } from "@ngrx/store";

export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
    return (state, action) => {
        console.log("---> ACTION: " + action.type);
        // console.log("STATE: Before:" + JSON.stringify(state));

        const newState = reducer(state, action);
        // console.log("STATE: After:" + JSON.stringify(newState));

        return newState;
    };
}
