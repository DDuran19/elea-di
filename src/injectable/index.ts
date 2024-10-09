import Singleton from "../singleton/index.js";

/**
 * The Injectable class is meant to be extended by any class that will be registered as a dependency.
 * All dependencies should extend this class to ensure they can be injected and managed by the container.
 *
 * Classes that extend Injectable must declare their dependencies using a static `_dependencies` array.
 * The order of dependencies in the array must match the constructor parameter order.
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
    static _dependencies: Array<
        typeof Injectable | (new (...args: any[]) => Injectable) | any
    >;

    static _runTimeDependencies: Array<any>;

    /**
     * A constant indicating that the class is injectable.
     *
     * @type {true}
     * @constant
     */
    static injectable: true = true;
}

export default Injectable;
