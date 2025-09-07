import type {
    IDynamicParameters,
    IDynamicProps,
    IParameter, IParameterCallable, IParameterCallableSet,
    IParametersCallableMap,
    IParametersMap
} from "@/types";


export class DynamicParameter<T extends IDynamicProps<T>> implements IDynamicParameters<T> {
    public readonly signal: IParametersCallableMap<T> = new Map();

    public readonly stack: IParametersMap<T>;

    constructor(public readonly initial: IDynamicProps<T>,) {
        this.stack = new Map();
        this.initialize();
    }

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
