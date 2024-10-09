import container from "../container/index.js";
import simpleHash from "../utils/index.js";

/**
 * Class for managing values using a hash map.
 */
export class Value {
    /**
     * Flag indicating that this class is injectable.
     * @type {boolean}
     */
    static injectable: boolean = true;

    /**
     * Map of registered values keyed by their hash.
     * @type {Map<number, any>}
     */
    static _registeredValues: Map<number, any> = new Map();

    /**
     * Adds a value to the map, hashed by its content.
     * @param {any} value - The value to be added.
     */
    static add(value: any, customKey?: `edi-${string}`) {
        Value._registeredValues.set(
            customKey ? simpleHash(customKey) : simpleHash(value),
            value
        );
    }

    /**
     * Checks if the map contains a value with the given key.
     * @param {any} key - The key to be checked (before hashing).
     * @returns {false | number} - Returns the hashed key if it exists, otherwise false.
     */
    static has(key: any): false | number {
        const hashed_key = simpleHash(key);
        return Value._registeredValues.has(hashed_key) ? hashed_key : false;
    }

    /**
     * Retrieves a value from the map by its hashed key.
     * @param {number} key - The hashed key of the value to retrieve.
     * @returns {any} - The value associated with the key, or undefined if not found.
     */
    static get(key: number): any {
        return Value._registeredValues.get(key);
    }
}

/**
 * Registers a value in the container and adds it to the Value class's map.
 * @template T
 * @param {T} value - The value to register and add.
 * @param {`edi-${string}`} [customKey] - The custom key to use for the value.
 * The custom key must start with "edi-" when using TypeScript.
 * @returns {T} - The same value passed as input.
 */
export function value<T extends any>(value: T, customKey?: `edi-${string}`): T {
    container.register(Value);
    Value.add(value, customKey);
    return value;
}

export default value;
