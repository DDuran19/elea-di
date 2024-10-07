export abstract class Singleton {
    private static instances = new Map<Function, Singleton>();

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
    ): T {
        if (!Singleton.instances.has(instantiator)) {
            const instance = new instantiator(...args);
            Singleton.instances.set(instantiator, instance);
        }
        return Singleton.instances.get(instantiator) as T;
    }

    /**
     * Checks if an instance of the specified instantiator exists.
     *
     * @param instantiator The subclass of Singleton to check.
     * @returns True if an instance exists, false otherwise.
     */
    static has(instantiator: Function) {
        return Singleton.instances.has(instantiator);
    }

    /**
     * Gets the instance of the specified instantiator.
     *
     * @param instantiator The subclass of Singleton to get the instance of.
     * @returns The instance of the subclass.
     */
    static get(instantiator: Function) {
        return Singleton.instances.get(instantiator);
    }

    /**
     * Gets all singleton instances.
     *
     * @returns A map of all singleton instances.
     */
    static get singletons() {
        return Singleton.instances;
    }
}

export default Singleton;
