export type IParameter<V = unknown> = {
    value: V;
    defaultValue?: V;
    callback?: IParameterCallable<V>;
};

export type IStaticProps<T> = T[];

export type IParametersSet<T> = Set<T>;
export type IParametersMap<T> = Map<keyof T, IParameter<T[keyof T]>>;

export type IDynamicProps<T> = Record<keyof T, IParameter<T[keyof T]>>;
export type IParametersCallableMap<T> = Map<keyof T, IParameterCallableSet<T>>;
export type IParameterCallableSet<T> = Set<IParameterCallable<T[keyof T]>>;
export type IParameterCallable<V> = (payload: V) => void;

export interface IParameterStack<T extends (IDynamicProps<T> | IStaticProps<T>)> {
    reset(): this;

    clear(): this;

    clone(): this;
}

export interface IParameterDynamicEvents<T extends IDynamicProps<T>> {
    listen<K extends keyof T>(key: K, callback: IParameterCallable<T[K]>): this;

    dispatch<K extends keyof T>(key: K): this;
}

export interface IParameterStaticEvents<T extends IDynamicProps<T>> {
    listen<K extends keyof T>(callback: IParameterCallable<T[K]>): this;

    dispatch<K extends keyof T>(key: K): this;
}

export interface IDynamicParameters<T extends IDynamicProps<T>> extends IParameterStack<T>, IParameterDynamicEvents<T> {
    readonly initial: IDynamicProps<T>;
    readonly stack: IParametersMap<T>;

    get entries(): T;

    get<K extends keyof T>(key: K): T[K] | undefined;

    set<K extends keyof T>(
        key: K,
        value: T[K],
        defaultValue?: T[K],
        callback?: IParameterCallable<T[K]>
    ): this;

    update<K extends keyof T>(key: K, value: T[K]): this;

    has<K extends keyof T>(key: K): boolean;

    remove<K extends keyof T>(key: K): this;
}

export interface IStaticParameters<T extends IStaticProps<T>> extends IParameterStack<T> {
    readonly initial: IStaticProps<T>;
    readonly stack: IParametersSet<T>;

    get value(): T | undefined;

    entries(): T[];

    add(value: T): this;

    has(key: T): boolean;

    remove(key: T): this;
}