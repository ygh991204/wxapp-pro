export declare type Action<D = any> = ReturnType<typeof createAction<D>>;
export declare function createAction<T = any>(type: string, payload?: T): {
    type: string;
    payload?: T;
};
