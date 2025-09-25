# Protorians Parameters

Bibliothèques légères et typées pour gérer des paramètres dans vos applications TypeScript/JavaScript.

- Langue : Français | [English](./README.md)
- Package : `@protorians/parameters`
- Node : >= 22

## Installation

Avec votre gestionnaire de paquets préféré :

```bash
pnpm add @protorians/parameters
# ou
npm i @protorians/parameters
# ou
yarn add @protorians/parameters
```

## Aperçu

Le paquet expose deux aides minimales pour manipuler des paramètres en mémoire :

- StaticParameter<T> — un sac (type Set) pour des valeurs statiques (ex. fonctions activées, étiquettes sélectionnées).
- DynamicParameter<T> — une table clé‑valeur de paramètres avec valeurs par défaut et écouteurs de changement optionnels.

Les deux sont fortement typés avec TypeScript.

## StaticParameter

StaticParameter est une fine surcouche de Set avec une petite API pratique.

```ts
import { StaticParameter } from "@protorians/parameters";

// Déclarer le type de valeur
type Feature = "beta" | "dark-mode" | "a11y";

// Créer avec des valeurs initiales
const features = new StaticParameter<Feature>(["a11y"]);

features.add("dark-mode");
console.log(features.has("a11y")); // true
console.log(features.entries()); // ["a11y", "dark-mode"]

console.log(features.value); // premier élément du Set (détail d’implémentation), ou undefined

// Réinitialiser vers les valeurs initiales
features.clear().add("beta");
features.reset(); // revient à ["a11y"]

// Cloner avec le même contenu initial
const copie = features.clone();
```

API (tableau) :

| Élément        | Signature                                  | Retour               | Description |
|----------------|---------------------------------------------|----------------------|-------------|
| constructeur   | new StaticParameter<T>(initial: T[])        | StaticParameter<T>   | Crée un sac avec des valeurs initiales. |
| value (get)    | value                                       | T \| undefined       | Premier élément du Set (s’il existe). |
| entries        | entries(): T[]                              | T[]                  | Instantané des valeurs courantes sous forme de tableau. |
| add            | add(value: T): this                         | this                 | Ajoute une valeur au Set. |
| has            | has(key: T): boolean                        | boolean              | Vérifie la présence d’une valeur. |
| remove         | remove(key: T): this                        | this                 | Supprime une valeur du Set. |
| clear          | clear(): this                               | this                 | Supprime toutes les valeurs courantes. |
| reset          | reset(): this                               | this                 | Clear puis ré‑applique les valeurs initiales. |
| clone          | clone(): this                               | this                 | Nouvelle instance avec les mêmes valeurs initiales. |

Remarques :
- S’appuie sur Set : valeurs uniques, ordre d’itération = ordre d’insertion.

## DynamicParameter

DynamicParameter gère une map de paramètres nommés avec valeurs par défaut et écouteurs.

Paramètres de type
- T décrit la forme de votre objet de données.
- Chaque propriété de T est stockée comme IParameter : `{ value, defaultValue?, callback? }`.

```ts
import { DynamicParameter } from "@protorians/parameters";

// Décrire la forme des paramètres
interface Conf {
  theme: "light" | "dark";
  page: number;
}

// Créer avec valeurs initiales (et défauts / callbacks optionnels)
const conf = new DynamicParameter<Conf>({
  theme: { value: "light", defaultValue: "light" },
  page:  { value: 1,       defaultValue: 1 }
});

// Lire
console.log(conf.get("theme")); // "light"

// Écrire
conf.set("theme", "dark");
conf.update("page", 2);

// Présence
console.log(conf.has("page")); // true

// Rassembler les valeurs simples
console.log(conf.entries); // { theme: "dark", page: 2 }

// Écouter les changements d’une clé
conf.listen("theme", (courant) => {
  console.log("Thème changé en", courant);
});

// Déclencher les écouteurs d’une clé
conf.dispatch("theme"); // invoque les écouteurs avec la valeur courante de theme

// Réinitialiser vers la définition initiale
conf.reset();

// Cloner vers une nouvelle instance avec la même définition initiale
const copie2 = conf.clone();
```

API (tableau, essentiel) :

| Élément       | Signature                                                                  | Retour              | Description |
|---------------|-----------------------------------------------------------------------------|---------------------|-------------|
| constructeur  | new DynamicParameter<T>(initial: Record<keyof T, IParameter<T[keyof T]>>)  | DynamicParameter<T> | Crée une instance avec la définition initiale. |
| entries (get) | entries                                                                     | T                   | Objet simple des valeurs courantes. |
| get           | get<K extends keyof T>(key: K): T[K] \| undefined                           | T[K] \| undefined   | Valeur courante, ou `defaultValue` si `value` est falsy et qu’un défaut existe. |
| set           | set<K extends keyof T>(key: K, value: T[K], defaultValue?, callback?)       | this                | Définit la valeur (et éventuellement le défaut) ; enregistre le callback s’il est fourni. |
| update        | update<K extends keyof T>(key: K, value: T[K])                              | this                | Met à jour seulement si la clé existe déjà. |
| has           | has<K extends keyof T>(key: K): boolean                                     | boolean             | Vérifie la présence d’une clé. |
| remove        | remove<K extends keyof T>(key: K): this                                     | this                | Supprime une clé de la map. |
| listen        | listen<K extends keyof T>(key: K, cb: (v: T[K]) => void): this              | this                | Enregistre un écouteur de changement pour une clé. |
| dispatch      | dispatch<K extends keyof T>(key: K): this                                   | this                | Déclenche les écouteurs d’une clé avec la valeur courante. |
| clear         | clear(): this                                                               | this                | Supprime toutes les valeurs courantes. |
| reset         | reset(): this                                                               | this                | Clear puis ré‑initialise à partir de la définition initiale. |
| clone         | clone(): this                                                               | this                | Nouvelle instance avec une copie superficielle de la définition initiale. |

Remarques :
- L’implémentation de get(key) renvoie `data?.value || data.defaultValue || undefined`. Si des valeurs falsy mais significatives sont attendues (ex. 0, ""), préférez `entries` ou vérifiez la présence au préalable.

## Définitions de types

Types exportés utiles :

| Type                    | Description |
|-------------------------|-------------|
| IParameter<V>           | Paramètre avec `value`, `defaultValue` (optionnel) et `callback` (optionnel). |
| IStaticProps<T>         | Alias pour T[] utilisé par le constructeur de StaticParameter. |
| IDynamicProps<T>        | Record associant chaque clé de T à `IParameter<T[keyof T]>`. |
| IStaticParameters<T>    | Interface implémentée par StaticParameter. |
| IDynamicParameters<T>   | Interface implémentée par DynamicParameter. |
| IParameterCallable<V>   | Signature d’écouteur pour les valeurs de DynamicParameter. |

Voir `source/types/index.ts` pour les définitions complètes.

## Développement

- Dev : pnpm dev
- Build : pnpm build

## Licence

ISC
