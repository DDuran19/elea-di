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
}
