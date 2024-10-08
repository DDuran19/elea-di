// types/index.d.ts

declare module "elea-di" {
    /**
     * The Singleton class provides a base for creating singleton instances.
     * It manages instances of subclasses to ensure that only one instance
     * exists per class.
     */
    export class Singleton {
        static instances: Map<Function, Singleton>;

        /**
         * Retrieves the instance of the subclass, creating it if it does not exist.
         *
         * @param instantiator The subclass of Singleton to get the instance of.
         * @param args The arguments to pass to the constructor of the subclass.
         * @returns The instance of the subclass.
         */
        static getInstance<T extends Singleton>(
            instantiator: new (...args: any[]) => T,
            ...args: any[]
        ): T;

        /**
         * Checks if an instance of the specified instantiator exists.
         *
         * @param instantiator The subclass of Singleton to check.
         * @returns True if an instance exists, false otherwise.
         */
        static has(instantiator: Function): boolean;

        /**
         * Gets the instance of the specified instantiator.
         *
         * @param instantiator The subclass of Singleton to get the instance of.
         * @returns The instance of the subclass.
         */
        static get<T extends Singleton>(
            instantiator: new (...args: any[]) => T
        ): T | undefined;

        /**
         * Gets all singleton instances.
         *
         * @returns A map of all singleton instances.
         */
        static get singletons(): Map<Function, Singleton>;
    }

    /**
     * The Injectable class is meant to be extended by any class that will be registered as a dependency.
     * All dependencies should extend this class to ensure they can be injected and managed by the container.
     *
     * Classes that extend Injectable must declare their dependencies using a static `_dependencies` array.
     * The order of dependencies in the array must match the constructor parameter order.
     *
     * **WARNING** : This class will make your class a SINGLETON. if you don't want this behavior,
     * please submit a ticket on [GitHub](https://github.com/DDuran19/elea-di/issues) for a feature request
     *
     * @example
     * // Define a class that extends Injectable
     * class LoggingService extends Injectable {
     *   static _dependencies = [DatabaseService, AuthenticationService];
     *
     *   constructor(db: DatabaseService, auth: AuthenticationService) {
     *     // LoggingService implementation
     *   }
     * }
     *
     * // Registering the LoggingService to the container will automatically resolve its dependencies.
     */
    export class Injectable extends Singleton {
        /**
         * An array of classes (or constructors) that represent the dependencies of this class.
         * The order of the dependencies in this array must match the constructor parameter order.
         *
         * @type {Array<typeof Injectable | new (...args: any[]) => Injectable>}
         */
        static _dependencies: (
            | typeof Injectable
            | (new (...args: any[]) => Injectable)
        )[];

        /**
         * A constant indicating that the class is injectable.
         *
         * @type {true}
         * @constant
         */
        static injectable: true;
    }

    /**
     * The Container class is responsible for managing dependency injection.
     * It handles the registration and resolution of injectable classes.
     * Dependencies are resolved recursively, ensuring that each class's dependencies are instantiated before the class itself.
     */
    export class Container {
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
         * Returns the singleton instance of the Container.
         * If the instance does not exist, it will be created.
         *
         * @returns {Container} The Container instance.
         */
        static get instance(): Container;

        /**
         * Returns the registered classes map.
         *
         * @returns {Map<Function, typeof Injectable>} The map of registered classes.
         */
        get registeredClasses(): Map<Function, typeof Injectable>;

        /**
         * Registers an injectable class to the container.
         *
         * @param {typeof Injectable | new (...args: any[]) => Injectable} injectable The class to register.
         * @returns {this} Returns the container instance for method chaining.
         */
        register(
            injectable: typeof Injectable | (new (...args: any[]) => Injectable)
        ): this;

        /**
         * Resolves an injectable to an instance.
         * If the class has not been instantiated, it will resolve its dependencies, instantiate the class, and return the instance.
         *
         * @param {new (...args: any) => T} injectable The injectable class to resolve.
         * @returns {T} The instance of the injectable class.
         * @template T
         */
        resolve<T extends Injectable = Injectable>(
            injectable: new (...args: any[]) => T
        ): T;

        /**
         * Checks if the injectable has been registered.
         *
         * @param {typeof Injectable} injectable The injectable class to check.
         * @throws {Error} Throws an error if the class is not registered.
         */
        private _checkRegistration(injectable: typeof Injectable): void;

        /**
         * Checks if the injectable class has been instantiated.
         *
         * @param {typeof Injectable} injectable The injectable class to check.
         * @returns {boolean} True if the class is instantiated, false otherwise.
         */
        private _checkInstantiation(injectable: typeof Injectable): boolean;

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
        ): T;
    }

    /**
     * The default container instance for the application.
     */
    export const container: Container;

    /**
     * The Value class is a simple injectable that wraps a value.
     * It extends the Injectable class to allow it to be managed by the container.
     */
    class Value extends Injectable {}

    /**
     * A function to automatically register a value as an injectable in the container
     * and retrieve its instance.
     *
     * @example
     * ```typescript
     * // src/config/index.ts
     * export const connectionString = value("db://localhost:27017");
     * 
     * // It returns the same object as what you provided,
     * // no worries about losing type-safety or functionality.
     * 
     * // src/schema.ts
     * 
     * function createSchema () {
     * const schema = value(z.object({
     *     foo: z.string(),
     *     baz: z.string(),
     * }),"edi-schema"); // key is required for values that are outside of scope of the class.
     }
     *
     * 
     * // src/my-service.ts
     * import { connectionString } from "../config";
     * 
     * class MyService extends Injectable {
         static _dependencies = [connectionString, "edi-schema"]; 

         constructor(
             private readonly _connectionString: string,
             private readonly _schema: z.infer<typeof schema>
         ) {
             super();
         }
     }
     * ```
     *
     * 
     * 
     * @template T
     * @param {T} value - The value to register and add.
     * @returns {T} - The same value passed as input.
     */
    export function value<T extends any>(value: T): T;
}
