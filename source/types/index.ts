/**
 * Represents a parameter with a value, an optional default value,
 * and an optional callback for additional functionality.
 *
 * @template V - The type of the value for the parameter.
 * @property {V} value - The current value of the parameter.
 * @property {V} [defaultValue] - The optional default value of the parameter.
 * @property {IParameterCallable<V>} [callback] - An optional callable function
 * that may be used to handle or modify the parameter.
 */
export type IParameter<V = unknown> = {
    value: V;
    defaultValue?: V;
    callback?: IParameterCallable<V>;
};

/**
 * Represents a generic type alias for a list of static properties.
 *
 * This type is designed to define a collection or an array
 * of elements of a particular type T. It can be used to represent
 * static data that is immutable or universally applicable
 * within a certain scope.
 *
 * @template T - The type of the elements in the array.
 */
export type IStaticProps<T> = T[];

/**
 * Represents a collection of unique parameters or items of a specified type.
 *
 * This type alias is defined as a `Set` of elements of type `T`, where `T` can be any valid data type.
 *
 * @template T - The type of elements stored in the parameters set.
 */
export type IParametersSet<T> = Set<T>;

/**
 * Represents a mapping of object keys to their associated parameters.
 *
 * IParametersMap is a generic type that provides a structure for associating
 * each key of an object with an IParameter instance. It uses a Map to store
 * these associations, enabling efficient lookup, iteration, and manipulation
 * of related parameters for keys of a given object.
 *
 * @template T The type of the base object whose keys and corresponding parameters are being represented.
 */
export type IParametersMap<T> = Map<keyof T, IParameter<T[keyof T]>>;

/**
 * Represents a type definition utility designed to dynamically transform the properties
 * of a given type `T`. Each property in `T` is mapped to a corresponding `IParameter<T>`
 * type value, where `IParameter<T>` encapsulates the details or configurations relevant
 * to the specific property type.
 *
 * This type is typically used to define structures where property specifications are
 * dynamically parametrized based on another type. It can be particularly useful when
 * working with dynamic forms, configuration schemas, or middleware systems where
 * the behavior or constraints of properties in `T` are described by parameterized objects.
 *
 * @template T The base object type whose properties are being parameterized.
 */
export type IDynamicProps<T> = Record<keyof T, IParameter<T[keyof T]>>;

/**
 * Represents a type-safe map that links a specific key of a generic type `T` to a set of callable parameters.
 *
 * @template T - The generic type for the map's keys.
 */
export type IParametersCallableMap<T> = Map<keyof T, IParameterCallableSet<T>>;

/**
 * Represents a specialized set containing callable entities associated with the keys of a given type.
 *
 * This type defines a set of callable parameter elements where each callable corresponds
 * to the values of the given type's keys. It is used to enforce type-safe collections
 * of parameterized callables in a structured, strongly typed manner.
 *
 * @template T The type whose keys' values determine the callable parameter types.
 */
export type IParameterCallableSet<T> = Set<IParameterCallable<T[keyof T]>>;

/**
 * A generic type definition representing a callable function that operates on a payload of type V.
 *
 * This type is intended for scenarios where a function needs to be provided to handle or process a specific payload.
 *
 * @template V - The type of the payload that will be passed to the callable function.
 * @callback IParameterCallable
 * @param {V} payload - The input value or parameter that the function will process or act upon.
 * @returns {void} - Indicates that the function does not return a value.
 */
export type IParameterCallable<V> = (payload: V) => void;

/**
 * Represents a stack structure to manage parameters with functionalities to reset, clear, or clone the state.
 *
 * @typeparam T A type extending either `IDynamicProps<T>` or `IStaticProps<T>`.
 */
export interface IParameterStack<T extends (IDynamicProps<T> | IStaticProps<T>)> {
    /**
     * Resets the current state of the object to its initial configuration.
     * This method modifies the instance in place and allows method chaining.
     *
     * @return {this} Returns the current instance after the reset operation.
     */
    reset(): this;

    /**
     * Clears all elements or data from the current collection or object, resetting it to an empty state.
     * @return {this} Returns the current instance to allow for method chaining.
     */
    clear(): this;

    /**
     * Creates and returns a duplicate of the current instance.
     *
     * @return {this} A new instance that is a copy of the current object.
     */
    clone(): this;

    /**
     * Creates and returns a clone of the original object.
     *
     * @return {this} A new instance that is a copy of the original object.
     */
    cloneOriginal(): this;
}

/**
 * An interface that handles dynamic parameter-based events, allowing for listening to and dispatching events associated with specific keys.
 *
 * @template T Represents the type that extends `IDynamicProps` to denote the structure of dynamic parameters.
 */
export interface IParameterDynamicEvents<T extends IDynamicProps<T>> {
    /**
     * Attaches a listener for a specific key and executes the provided callback when the key is triggered.
     *
     * @param {K} key The specific key to listen to for events. Must be a valid key of type T.
     * @param {IParameterCallable<T[K]>} callback A callback function to execute when the specified key is triggered. The parameter type of the callback corresponds to the type associated with the key in T.
     * @return {this} The instance of the current object for method chaining.
     */
    listen<K extends keyof T>(key: K, callback: IParameterCallable<T[K]>): this;

    /**
     * Dispatches an action associated with the specified key.
     *
     * @param {K} key - The key corresponding to the action to be dispatched.
     * @return {this} The current instance for method chaining.
     */
    dispatch<K extends keyof T>(key: K): this;
}

/**
 * Interface representing static event handling for a set of dynamic properties.
 * Provides methods to listen for changes and dispatch events related to specific properties.
 *
 * @template T - A type extending `IDynamicProps` that represents the dynamic properties for which events are managed.
 */
export interface IParameterStaticEvents<T extends IDynamicProps<T>> {
    /**
     * Registers a listener with a callback for the specified event type.
     *
     * @param {IParameterCallable<T[K]>} callback - The function to be executed when the event of type K is emitted. The callback receives the associated data of type T[K].
     * @return {this} The current instance to allow method chaining.
     */
    listen<K extends keyof T>(callback: IParameterCallable<T[K]>): this;

    /**
     * Dispatches an event or action corresponding to the given key.
     *
     * @param {K} key The key representing the specific event or action to be dispatched. It must be a valid key of the object type T.
     * @return {this} Returns the current instance to allow for method chaining.
     */
    dispatch<K extends keyof T>(key: K): this;
}

/**
 * Represents a dynamic parameter structure that supports operations to manage, update,
 * and retrieve parameters dynamically. This interface extends functionality from
 * IParameterStack and IParameterDynamicEvents.
 *
 * @template T The type of dynamic properties extending IDynamicProps.
 */
export interface IDynamicParameters<T extends IDynamicProps<T>> extends IParameterStack<T>, IParameterDynamicEvents<T> {
    /**
     * Represents the initial dynamic properties of type `T`.
     *
     * This variable is a read-only property used to store the initial dynamic
     * state or configuration associated with a specific object or component.
     * It provides a way to initialize and access the starting state of
     * dynamic properties, ensuring that these properties remain immutable
     * and accessible throughout the lifecycle of the object or component.
     *
     * @type {IDynamicProps<T>}
     */
    readonly initial: IDynamicProps<T>;

    /**
     * Represents a read-only stack that stores a collection of elements.
     * The elements are managed using a parameterized map structure.
     *
     * @type {IParametersMap<T>}
     * Contains the items of the stack where each item is mapped using
     * parameterized keys and values of generic type `T`.
     */
    readonly stack: IParametersMap<T>;

    /**
     * Retrieves the entries stored in the current instance.
     * @return {T} The entries of type T associated with this instance.
     */
    get entries(): T;

    /**
     * Retrieves the value associated with the given key from the object.
     *
     * @param {K} key - The key for which the corresponding value needs to be retrieved.
     * @return {T[K] | undefined} The value associated with the specified key, or undefined if the key does not exist.
     */
    get<K extends keyof T>(key: K): T[K] | undefined;

    /**
     * Updates the value for the specified key in the instance. Optionally allows providing a default value
     * and a callback that processes the parameter value.
     *
     * @param {K} key - The key of the property to set.
     * @param {T[K]} value - The value to set for the specified key.
     * @param {T[K]} [defaultValue] - The default value to assign if the `value` is not provided.
     * @param {IParameterCallable<T[K]>} [callback] - An optional callback function to apply to the parameter value.
     * @return {this} Returns the current instance to allow method chaining.
     */
    set<K extends keyof T>(
        key: K,
        value: T[K],
        defaultValue?: T[K],
        callback?: IParameterCallable<T[K]>
    ): this;

    /**
     * Updates the value associated with the specified key in the current object.
     *
     * @param {K} key - The key of the property to be updated.
     * @param {T[K]} value - The new value to set for the specified key.
     * @return {this} Returns the current instance to allow method chaining.
     */
    update<K extends keyof T>(key: K, value: T[K]): this;

    /**
     * Determines whether the given key exists in the object.
     *
     * @param {K} key - The key to check for existence in the object.
     * @return {boolean} Returns true if the key exists in the object, otherwise false.
     */
    has<K extends keyof T>(key: K): boolean;

    /**
     * Removes the specified property from the current object.
     *
     * @param {K} key - The key of the property to be removed.
     * @return {this} The instance of the object after removing the specified property.
     */
    remove<K extends keyof T>(key: K): this;
}

/**
 * Interface representing a static parameter container with immutable properties and stack management.
 *
 * @template T The type that extends IStaticProps allowing static property enforcement.
 */
export interface IStaticParameters<T extends IStaticProps<T>> extends IParameterStack<T> {

    /**
     * A readonly variable representing the initial static properties.
     * It contains the static properties of type `IStaticProps<T>` that are immutable.
     *
     * @type {IStaticProps<T>}
     */
    readonly initial: IStaticProps<T>;

    /**
     * A read-only property representing a stack of parameters.
     * This stack is used to store and manage a set of parameters of generic type `T`.
     * Operations on this stack can include pushing, popping, or iterating
     * through the stored parameters, depending on the implementation of `IParametersSet<T>`.
     *
     * The stack enforces immutability, ensuring that changes cannot be directly applied
     * to the original stack instance. Any modification would require creating a new instance.
     *
     * @type {IParametersSet<T>} The stack containing a generic set of parameters.
     */
    readonly stack: IParametersSet<T>;

    /**
     * Retrieves the current value.
     *
     * @return {T | undefined} The current value if set, otherwise undefined.
     */
    get value(): T | undefined;

    /**
     * Retrieves all entries from the collection.
     *
     * @return {T[]} An array containing all the entries in the collection.
     */
    entries(): T[];

    /**
     * Adds a value to the collection or data structure.
     *
     * @param {T} value - The value to be added.
     * @return {this} Returns the current instance for method chaining.
     */
    add(value: T): this;

    /**
     * Checks if the given key exists in the collection.
     *
     * @param {T} key - The key to check for existence in the collection.
     * @return {boolean} Returns true if the key exists, otherwise false.
     */
    has(key: T): boolean;

    /**
     * Removes the specified key from the collection.
     *
     * @param {T} key - The key to be removed from the collection.
     * @return {this} The instance of the current object, allowing for method chaining.
     */
    remove(key: T): this;
}