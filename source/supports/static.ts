import type {IParametersSet, IStaticParameters, IStaticProps} from "@/types";


/**
 * Represents a collection of static parameters that can be managed through a set-like interface.
 * This class allows adding, removing, resetting, and cloning of the parameters while retaining
 * the initial state for reference.
 *
 * @template T A type that extends `IStaticProps<T>` to ensure type compatibility.
 * @implements {IStaticParameters<T>}
 */
export class StaticParameter<T extends IStaticProps<T>> implements IStaticParameters<T> {

    readonly stack: IParametersSet<T>;

    constructor(
        public readonly initial: IStaticProps<T>,
    ) {
        this.stack = new Set();
        this.initialize();
    }

    entries(): T[] {
        return [...this.stack.values()] as T[];
    }

    /**
     * Initializes the current instance by iterating through the `initial` collection
     * and adding its values using the `add` method.
     * @return {this} The current instance for method chaining.
     */
    protected initialize(): this {
        for (const value of this.initial)
            this.add(value);
        return this;
    }

    get value(): T | undefined {
        return [...this.stack.values()][0] || undefined;
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

    cloneOriginal(): this {
        return new (this.constructor as any)([...this.stack.entries()]);
    }
}