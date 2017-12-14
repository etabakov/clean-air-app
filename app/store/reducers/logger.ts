import { ActionReducer } from "@ngrx/store";

export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
    return (state, action) => {
        console.log("action:" + JSON.stringify(action));
        console.log("state Before:" + JSON.stringify(state));

        const newState = reducer(state, action);
        console.log("state After:" + JSON.stringify(newState));

        return newState;
    };
}
