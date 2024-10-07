export class Singleton {
    static instances = new Map();
    /**
     * Static method to get the instance of the subclass
     * @param instantiator The subclass of Singleton to get the instance of
     * @param args The arguments to pass to the constructor of the subclass
     * @returns The instance of the subclass
     */
    static getInstance(instantiator, ...args) {
        if (!Singleton.instances.has(instantiator)) {
            const instance = new instantiator(...args);
            Singleton.instances.set(instantiator, instance);
        }
        return Singleton.instances.get(instantiator);
    }
    static has(instantiator) {
        return Singleton.instances.has(instantiator);
    }
    static get(instantiator) {
        return Singleton.instances.get(instantiator);
    }
    static get singletons() {
        return Singleton.instances;
    }
}
export default Singleton;
