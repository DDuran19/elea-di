// types/index.d.ts

declare module "elea-di" {
    /**
     * The Injectable class is meant to be extended by any class that will be registered as a dependency.
     */
    export class Injectable extends Singleton {
        /**
         * An array of classes (or constructors) that represent the dependencies of this class.
         */
        static _dependencies: (
            | typeof Injectable
            | (new (...args: any[]) => Injectable)
        )[];

        /**
         * A constant indicating that the class is injectable.
         */
        static injectable: true;
    }

    /**
     * The Container class is responsible for managing dependency injection.
     */
    export class Container {
        private static _instance: Container;
        private _registeredClasses: Map<Function, typeof Injectable>;

        /**
         * Returns the singleton instance of the Container.
         * If the instance does not exist, it will be created.
         *
         * @returns The Container instance.
         */
        static get instance(): Container;

        /**
         * Returns the registered classes map.
         *
         * @returns The map of registered classes.
         */
        get registeredClasses(): Map<Function, typeof Injectable>;

        /**
         * Registers an injectable class to the container.
         *
         * @param injectable The class to register.
         * @returns The container instance for method chaining.
         */
        register(
            injectable: typeof Injectable | (new (...args: any[]) => Injectable)
        ): this;

        /**
         * Resolves an injectable to an instance.
         *
         * @param injectable The injectable class to resolve.
         * @returns The instance of the injectable class.
         */
        resolve<T extends Injectable = Injectable>(
            injectable: new (...args: any[]) => T
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
    export class Value extends Injectable {
        /**
         * An array of dependencies for this injectable class.
         * In this case, there are no dependencies.
         *
         * @type {Array}
         */
        static _dependencies;

        /**
         * Creates an instance of the Value class.
         *
         * @param {any} value The value to be wrapped by this class.
         */
        constructor(value: any) {
            super();
            return value; // Return the wrapped value.
        }
    }

    /**
     * A function to register a value as an injectable in the container
     * and retrieve its instance.
     *
     * @param {any} value The value to register and retrieve.
     * @returns {any} The instance of the Value class containing the provided value.
     */
    export function value(value: any): any;
}
