import type {
    IDynamicParameters,
    IDynamicProps,
    IParameter, IParameterCallable, IParameterCallableSet,
    IParametersCallableMap,
    IParametersMap
} from "@/types";

/**
 * The `DynamicParameter` class provides a mechanism for managing dynamic, key-value paired parameters
 * with support for default values, callbacks, and change notification. It enables storing, retrieving,
 * updating, and listening to parameter values in a structured and reactive manner.
 *
 * @template T Extends `IDynamicProps<T>`, representing the shape of the parameters and their metadata.
 * @implements {IDynamicParameters<T>}
 */
export class DynamicParameter<T extends IDynamicProps<T>> implements IDynamicParameters<T> {
    /**
     * A variable that represents a mapping of parameters to callable entities.
     * It is instantiated as a Map where the key-value pairs can dynamically
     * associate specific parameters with corresponding functions or data handlers.
     *
     * @type {IParametersCallableMap<T>}
     */
    public readonly signal: IParametersCallableMap<T> = new Map();

    /**
     * A variable representing a stack of parameters mapped to a specific type.
     *
     * This stack is a collection where each element corresponds to a specific key and value pair,
     * providing storage and access to parameterized data. The generic type `T` denotes the type
     * of values stored in the map, allowing flexibility for various data types.
     *
     * @typedef {Object} stack
     * @template T
     * @type {IParametersMap<T>}
     */
    public readonly stack: IParametersMap<T>;

    /**
     * Constructs an instance of the class with an initial set of dynamic properties.
     *
     * @param {IDynamicProps<T>} initial - The initial dynamic properties to be set for the instance.
     * @return {void} This constructor does not return a value.
     */
    constructor(public readonly initial: IDynamicProps<T>,) {
        this.stack = new Map();
        this.initialize();
    }

    /**
     * Initializes the instance by iterating over the initial parameters,
     * setting their values along with optional default values and invoking any callbacks associated.
     *
     * @return {void} Does not return any value.
     */
    protected initialize(): void {
        for (const [key, data] of Object.entries(this.initial) as ([keyof T, IParameter<T[keyof T]>][])) {
            this.set(key, data.value, data.defaultValue, data.callback);
        }
    }

    get entries(): T {
        const accumulate = {} as T;
        for (const [key, value] of this.stack) {
            accumulate[key] = value.value;
        }
        return accumulate;
    }

    get<K extends keyof T>(key: K): T[K] | undefined {
        const data = this.stack.get(key)
        return data ? ((data?.value as any) || data.defaultValue || undefined) : undefined;
    }

    set<K extends keyof T>(key: K, value: T[K], defaultValue?: T[K], callback?: IParameterCallable<T[K]>): this {
        this.stack.set(key, {
            value,
            defaultValue: defaultValue || value,
            callback
        } as IParameter<T[keyof T]>);

        if (callback) this.listen(key, callback);
        this.dispatch(key);
        return this;
    }

    update<K extends keyof T>(key: K, value: T[K]): this {
        if (this.has(key))
            this.set(key, value);
        return this;
    }

    has<K extends keyof T>(key: K): boolean {
        return this.stack.has(key);
    }

    remove<K extends keyof T>(key: K): this {
        this.stack.delete(key);
        return this;
    }

    reset(): this {
        this.stack.clear();
        this.initialize()
        return this;
    }

    clear(): this {
        this.stack.clear();
        return this;
    }

    clone(): this {
        return new (this.constructor as any)(
            {...this.entries}
        );
    }

    cloneOriginal(): this {
        return new (this.constructor as any)(
            {...this.initial}
        );
    }

    listen<K extends keyof T>(key: K, callback: IParameterCallable<T[K]>) {
        const set: IParameterCallableSet<T> = this.signal.get(key) || new Set();
        set.add(callback as IParameterCallable<T[keyof T]>);
        this.signal.set(key, set);
        return this;
    }

    dispatch<K extends keyof T>(key: K): this {
        for (const [index, set] of [...this.signal.entries()])
            if (key == index)
                for (const callable of set)
                    callable(this.get(key as keyof T) as T[keyof T]);
        return this;
    }
}
