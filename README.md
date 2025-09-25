# Protorians Parameters

Lightweight, type-safe parameter containers for TypeScript/JavaScript apps.

- Languages: English | [Français](./README.fr.md)
- Package: `@protorians/parameters`
- Node: >= 22

## Installation

Use your favorite package manager:

```bash
pnpm add @protorians/parameters
# or
npm i @protorians/parameters
# or
yarn add @protorians/parameters
```

## Overview

This package provides two minimal helpers to manage parameters in memory:

- StaticParameter<T> — a simple Set-like bag for static values (e.g., enabled features, selected tags).
- DynamicParameter<T> — a key-value map of parameters with optional defaults and change listeners.

Both are strongly typed when used with TypeScript.

## StaticParameter

StaticParameter is a thin wrapper over Set with a small convenience API.

```ts
import { StaticParameter } from "@protorians/parameters";

// Declare the value type
type Feature = "beta" | "dark-mode" | "a11y";

// Create with initial values
const features = new StaticParameter<Feature>(["a11y"]);

features.add("dark-mode");
console.log(features.has("a11y")); // true
console.log(features.entries()); // ["a11y", "dark-mode"]

console.log(features.value); // first value in the set (implementation detail), or undefined

// Reset back to initial values
features.clear().add("beta");
features.reset(); // back to ["a11y"]

// Clone with the same initial content
const copy = features.clone();
```

API (table):

| Member        | Signature                                 | Returns              | Description |
|---------------|-------------------------------------------|----------------------|-------------|
| constructor   | new StaticParameter<T>(initial: T[])       | StaticParameter<T>   | Create a new bag with initial values. |
| value (get)   | value                                      | T \| undefined       | First value in the set (if any). |
| entries       | entries(): T[]                             | T[]                  | Array snapshot of current values. |
| add           | add(value: T): this                        | this                 | Add a value to the set. |
| has           | has(key: T): boolean                       | boolean              | Check if a value exists. |
| remove        | remove(key: T): this                       | this                 | Remove a value from the set. |
| clear         | clear(): this                              | this                 | Remove all current values. |
| reset         | reset(): this                              | this                 | Clear then re-apply initial values. |
| clone         | clone(): this                              | this                 | New instance with the same initial values. |

Notes:
- Internally uses Set, so values are unique and iteration order is insertion order.

## DynamicParameter

DynamicParameter manages a map of named parameters with optional defaults and change listeners.

Type parameters
- T describes the shape of your data object.
- Each property of T is stored as an IParameter: `{ value, defaultValue?, callback? }`.

```ts
import { DynamicParameter } from "@protorians/parameters";

// Describe the parameter shape
interface Conf {
  theme: "light" | "dark";
  page: number;
}

// Create with initial values (and optional defaults / callbacks)
const conf = new DynamicParameter<Conf>({
  theme: { value: "light", defaultValue: "light" },
  page:  { value: 1,       defaultValue: 1 }
});

// Read
console.log(conf.get("theme")); // "light"

// Write
conf.set("theme", "dark");
conf.update("page", 2);

// Presence
console.log(conf.has("page")); // true

// Collect plain entries (values only)
console.log(conf.entries); // { theme: "dark", page: 2 }

// Listen to changes for a key
conf.listen("theme", (current) => {
  console.log("Theme changed to", current);
});

// Trigger listeners for a key
conf.dispatch("theme"); // invokes listeners with current value of theme

// Reset to initial definition
conf.reset();

// Clone to a new instance with the same initial definition
const copy = conf.clone();
```

API (table):

| Member      | Signature                                                                 | Returns            | Description |
|-------------|-----------------------------------------------------------------------------|--------------------|-------------|
| constructor | new DynamicParameter<T>(initial: Record<keyof T, IParameter<T[keyof T]>>)  | DynamicParameter<T>| Create with the initial parameter definition. |
| entries (get)| entries                                                                    | T                  | Plain object of current values only. |
| get         | get<K extends keyof T>(key: K): T[K] \| undefined                           | T[K] \| undefined  | Current value, or defaultValue if value is falsy and a default exists. |
| set         | set<K extends keyof T>(key: K, value: T[K], defaultValue?, callback?)       | this               | Set value (and optional default); register callback as listener when provided. |
| update      | update<K extends keyof T>(key: K, value: T[K])                              | this               | Update only if the key already exists. |
| has         | has<K extends keyof T>(key: K): boolean                                     | boolean            | Check key presence. |
| remove      | remove<K extends keyof T>(key: K): this                                     | this               | Remove a key from the map. |
| listen      | listen<K extends keyof T>(key: K, cb: (v: T[K]) => void): this              | this               | Register a change listener for a key. |
| dispatch    | dispatch<K extends keyof T>(key: K): this                                   | this               | Invoke listeners for a key with the current value. |
| clear       | clear(): this                                                               | this               | Remove all current values. |
| reset       | reset(): this                                                               | this               | Clear then re-initialize from initial. |
| clone       | clone(): this                                                               | this               | New instance with a shallow copy of the initial definition. |

Notes:
- When reading with get(key), the implementation returns `data?.value || data.defaultValue || undefined`. If value can be a falsy-but-meaningful value (e.g. 0 or ""), ensure you rely on entries or check presence accordingly.

## Type Definitions

Relevant exported types are available under `@protorians/parameters`:

| Type                         | Description |
|------------------------------|-------------|
| IParameter<V>                | Describes a parameter item with value, optional defaultValue and optional callback. |
| IStaticProps<T>              | Alias for T[] used by StaticParameter constructor. |
| IDynamicProps<T>             | Record mapping keys of T to IParameter<T[keyof T]>. |
| IStaticParameters<T>         | Interface implemented by StaticParameter. |
| IDynamicParameters<T>        | Interface implemented by DynamicParameter. |
| IParameterCallable<V>        | Listener signature for DynamicParameter values. |

See `source/types/index.ts` for the complete definitions.

## Development

- Dev: pnpm dev
- Build: pnpm build

## License

ISC
