import type { Action } from './createAction';
import type { ITypeIObject, IAnyObject } from '../type';
export declare type ModuleCaseReducers<State extends IAnyObject = IAnyObject> = ITypeIObject<(state: State, action: Action) => State>;
export declare type ModuleReducer = ReturnType<typeof createModule>['reducer'];
export declare function createModule<State extends IAnyObject = IAnyObject, CR extends ModuleCaseReducers<State> = ModuleCaseReducers<State>, Name extends String = string>(option: {
    name: Name;
    initialState: State | (() => State);
    reducers?: CR;
    extraReducers?: ModuleCaseReducers<State>;
}): {
    actions: { [K in keyof CR]: (payload?: any) => Action; };
    name: Name;
    reducer: {
        caseReducers: CR;
        name: Name;
        getInitialState(): State;
        extraReducers: ModuleCaseReducers<State>;
    };
};
