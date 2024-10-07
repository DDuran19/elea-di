import container from "../container/index.js";
import Injectable from "../injectable/index.js";
/**
 * The Value class is a simple injectable that wraps a value.
 * It extends the Injectable class to allow it to be managed by the container.
 */
export class Value extends Injectable {
    value;
    static _instances = new Map();
    /**
     * A constant indicating that the class is injectable.
     *
     * @type {true}
     * @constant
     */
    static injectable = true;
    /**
     * Creates an instance of the Value class.
     *
     * @param {any} value The value to be wrapped by this class.
     */
    constructor(value) {
        super();
        this.value = value;
        Value._instances.set(value, this);
        return value; // Return the wrapped value.
    }
    /**
     * Adds a value to the Value class' instances map.
     * If the value does not already exist in the map, it is added and an instance of the Value class is created.
     * If the value already exists, it is returned from the existing instance.
     *
     * @param {typeof Value} instantiator The Value class to create an instance of if the value does not exist.
     * @param {T} value The value to add to the map.
     * @returns {T} The instance of the Value class containing the provided value.
     */
    static add(instantiator, value) {
        const _value = JSON.stringify(value);
        if (!Value._instances.has(_value)) {
            Value._instances.set(_value, new instantiator(value));
        }
        return Value._instances.get(_value);
    }
    /**
     * Checks if a value exists in the Value class' instances map.
     *
     * @param {string} value The value to check for.
     * @returns {boolean} True if the value exists, false otherwise.
     */
    static hasValue(value) {
        return Value._instances.has(value);
    }
    /**
     * Retrieves the instance of the Value class containing the provided value.
     *
     * @param {T} value The value to retrieve the instance for.
     * @returns {T} The instance of the Value class containing the provided value.
     */
    static getValue(value) {
        return Value._instances.get(JSON.stringify(value));
    }
    /**
     * Retrieves the wrapped value.
     *
     * @returns {any} The wrapped value.
     */
    get data() {
        return this.value;
    }
}
/**
 * A function to register a value as an injectable in the container
 * and retrieve its instance.
 *
 * @param {any} value The value to register and retrieve.
 * @returns {any} The instance of the Value class containing the provided value.
 */
export function value(value) {
    container.register(Value);
    return Value.add(Value, value);
}
export default value;
