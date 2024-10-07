export abstract class Singleton {
    private static instances = new Map<Function, Singleton>();

    /**
     * Static method to get the instance of the subclass
     * @param instantiator The subclass of Singleton to get the instance of
     * @param args The arguments to pass to the constructor of the subclass
     * @returns The instance of the subclass
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

    static has(instantiator: Function) {
        return Singleton.instances.has(instantiator);
    }

    static get(instantiator: Function) {
        return Singleton.instances.get(instantiator);
    }

    static get singletons() {
        return Singleton.instances;
    }
}

export default Singleton;
