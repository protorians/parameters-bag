import type {IParametersSet, IStaticParameters, IStaticProps} from "@/types";


export class StaticParameter<T extends IStaticProps<T>> implements IStaticParameters<T> {

    stack: IParametersSet<T>;

    constructor(
        public readonly initial: IStaticProps<T>,
    ) {
        this.stack = new Set();
        this.initialize();
    }

    entries(): T[] {
        return [...this.stack.values()] as T[];
    }

    protected initialize(): this {
        for (const value of this.initial) {
            this.add(value);
        }
        return this;
    }

    get value(): T | undefined {
        return this.stack.values().next().value || undefined;
    }

    add(value: T): this {
        this.stack.add(value);
        return this;
    }

    has(key: T): boolean {
        return this.stack.has(key);
    }

    remove(key: T): this {
        this.stack.delete(key);
        return this;
    }

    reset(): this {
        return this.clear().initialize();
    }

    clear(): this {
        this.stack.clear();
        return this;
    }

    clone(): this {
        return new (this.constructor as any)([...this.initial]);
    }
}