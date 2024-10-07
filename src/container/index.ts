import { Injectable } from "../injectable/index.js";
import Singleton from "../singleton/index.js";

/**
 * The Container class is responsible for managing dependency injection.
 * It handles the registration and resolution of injectable classes.
 * Dependencies are resolved recursively, ensuring that each class's dependencies are instantiated before the class itself.
 */
class Container {
    /**
     * Singleton instance of the Container.
     * @private
     * @type {Container}
     */
    private static _instance: Container;

    /**
     * A Map that stores the registered classes.
     * The key is the constructor of the class, and the value is the Injectable class.
     * @private
     * @type {Map<Function, typeof Injectable>}
     */
    private _registeredClasses: Map<Function, typeof Injectable>;

    /**
     * Private constructor to prevent instantiation.
     * Initializes the `_registeredClasses` Map.
     */
    private constructor() {
        this._registeredClasses = new Map<Function, typeof Injectable>();
    }

    /**
     * Returns the singleton instance of the Container.
     * If the instance does not exist, it will be created.
     *
     * @returns {Container} The Container instance.
     */
    static get instance(): Container {
        if (!Container._instance) {
            Container._instance = new Container();
        }
        return Container._instance;
    }

    /**
     * Returns the registered classes map.
     *
     * @returns {Map<Function, typeof Injectable>} The map of registered classes.
     */
    get registeredClasses(): Map<Function, typeof Injectable> {
        return this._registeredClasses;
    }

    /**
     * Registers an injectable class to the container.
     *
     * @param {typeof Injectable | new (...args: any[]) => Injectable} injectable The class to register.
     * @returns {this} Returns the container instance for method chaining.
     */
    register(
        injectable: typeof Injectable | (new (...args: any) => Injectable)
    ): this {
        this._registeredClasses.set(
            injectable,
            injectable as typeof Injectable
        );
        return this;
    }

    /**
     * Resolves an injectable to an instance.
     * If the class has not been instantiated, it will resolve its dependencies, instantiate the class, and return the instance.
     *
     * @param {new (...args: any) => T} injectable The injectable class to resolve.
     * @returns {T} The instance of the injectable class.
     * @template T
     */
    resolve<T extends Injectable = Injectable>(
        injectable: new (...args: any) => T
    ): T {
        const _injectable = injectable as unknown as typeof Injectable;
        // 1. Check if the class has been registered
        this._checkRegistration(_injectable);
        // 2. Check if the class has been instantiated
        const isInstantiated = this._checkInstantiation(_injectable);
        if (isInstantiated) return this._getInstance<T>(_injectable);

        // 3. Get dependencies of the class

        const dependencies = _injectable._dependencies;

        if (!dependencies || !dependencies.length) {
            return _injectable.getInstance(_injectable) as T;
        }

        // 4. Recursively check for dependencies if they have been registered and instantiated
        const dependencyInstances = dependencies.map((dependency) => {
            return this.resolve(dependency);
        });

        return _injectable.getInstance(
            _injectable,
            ...dependencyInstances
        ) as T;
    }

    /**
     * Checks if the injectable has been registered.
     *
     * @param {typeof Injectable} injectable The injectable class to check.
     * @throws {Error} Throws an error if the class is not registered.
     */
    private _checkRegistration(injectable: typeof Injectable): void {
        if (!this._registeredClasses.has(injectable)) {
            const message = `Class ${injectable.name} is not registered. Add it to the container. \`container.register(${injectable.name})\`); `;
            throw new Error(message);
        }
    }

    /**
     * Checks if the injectable class has been instantiated.
     *
     * @param {typeof Injectable} injectable The injectable class to check.
     * @returns {boolean} True if the class is instantiated, false otherwise.
     */
    private _checkInstantiation(injectable: typeof Injectable): boolean {
        if (Singleton.has(injectable)) {
            return true;
        }
        return false;
    }

    /**
     * Retrieves the instance of the injectable class.
     *
     * @param {typeof Injectable} injectable The class to get the instance for.
     * @returns {T} The instance of the injectable class.
     * @template T
     * @throws {Error} Throws an error if the class has not been instantiated.
     */
    private _getInstance<T extends Injectable>(
        injectable: typeof Injectable
    ): T {
        const instance = Singleton.get(injectable);
        if (!instance) {
            throw new Error(
                `Class ${injectable.name} is not instantiated. Add it to the container. \`container.register(${injectable.name})\`); `
            );
        }
        return instance as unknown as T;
    }
}

export const container = Container.instance;
export default container;