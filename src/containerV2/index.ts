function lowercase(str: string | ServerlessInjectable): string {
    if (typeof str === "string") {
        return str.toLowerCase();
    }
    if (str instanceof ServerlessInjectable) {
        return str.constructor.name.toLowerCase();
    }
    throw new Error(
        "Invalid input type for lowercase, expected string or ServerlessInjectable received: " +
            typeof str
    );
}

export class ServerlessInjectable {
    static __key__ = lowercase(this.name);
    static __dependencies__?: any[];
    constructor() {}
}

export class ServerlessValue {
    __value__: any;
    __key__: string;

    constructor(__value__: any, __key__: string) {
        this.__key__ = __key__;
        this.__value__ = __value__;

        return new Proxy(this, {
            get(target: any, prop: string | symbol, receiver: any) {
                if (prop === "__value__") {
                    return target.__value__;
                }
                if (prop === "__key__") {
                    return target.__key__;
                }
                const value = target.__value__[prop];
                if (typeof value === "function") {
                    // Bind the method to __value__ to maintain the correct `this` context
                    return value.bind(target.__value__);
                }
                // Return the property directly if it's not a function
                return value;
            },
        });
    }
}

type Constructor<T = any> = new (...args: any[]) => T;
export class ServerlessContainer {
    private _registeredClasses: Map<string, any> = new Map();
    private _instantiatedClasses: Map<string, any> = new Map();

    get registeredClasses() {
        return this._registeredClasses;
    }

    get instantiatedClasses() {
        return this._instantiatedClasses;
    }

    registerClass(Class: any): this {
        try {
            if (!("__key__" in Class) && !("__dependencies__" in Class)) {
                console.warn(
                    `WARNING: ${
                        Class.name || Class
                    } is most likely not a ServerlessInjectable. Check if you extended ServerlessInjectable correctly.`
                );
            }
            this._registeredClasses.set(
                lowercase(Class.prototype.constructor.name),
                Class
            );
            return this;
        } catch (error) {
            console.log(error);
            return this;
        }
    }

    registerRuntimeValue(value: any, key: string): this {
        const lowercased = lowercase(key);
        const newValue = new ServerlessValue(value, lowercased);
        this._instantiatedClasses.set(lowercased, newValue);
        return this;
    }

    injectRuntimeValue(key: string, value: any): any {
        const lowercased = lowercase(key);
        if (!this._instantiatedClasses.has(lowercased)) {
            throw new Error(
                `Value ${key} is not instantiated. Add it to the container. \`container.registerRuntimeValue( {},${key})\`); `
            );
        }
        const instance = this._instantiatedClasses.get(lowercased);
        instance.__value__ = value;
        this._instantiatedClasses.set(lowercased, instance);
        return value;
    }
    resolve<T>(Class: Constructor<T>): T {
        const isClass = this._isClass(Class);
        if (!isClass) {
            const value = this._instantiatedClasses.get(lowercase(Class));
            if (value) {
                return value.__value__;
            }
            throw new Error(
                `Class ${
                    Class instanceof Function ? Class.name : Class
                } is not registered in the container`
            );
        }

        const classKey = lowercase(Class.prototype.constructor.name);

        // Check if already instantiated (lazy initialization)
        if (this._instantiatedClasses.has(classKey)) {
            return this._instantiatedClasses.get(classKey);
        }

        // Resolve dependencies first, lazily loading them if necessary
        const dependencies: string[] = (Class as any).__dependencies__ || [];
        const dependencyInstances = dependencies.map((dep: string) => {
            const lowercased = lowercase(dep);
            if (!this._instantiatedClasses.has(lowercased)) {
                // Lazily instantiate dependency
                const registeredDep = this._registeredClasses.get(lowercased);
                if (!registeredDep) {
                    throw new Error(`Class ${dep} is not registered`);
                }
                const instance = this.resolve(registeredDep);
                this._instantiatedClasses.set(lowercased, instance);
            }
            return this._instantiatedClasses.get(lowercased);
        });

        // Instantiate the class after resolving its dependencies
        const instance = new Class(...dependencyInstances);
        this._instantiatedClasses.set(classKey, instance);

        return instance;
    }

    private _isClass(Class: any): boolean {
        return (
            Class &&
            typeof Class === "function" &&
            Class.prototype instanceof ServerlessInjectable
        );
    }
}

/**
 * Creates a new instance of the ServerlessContainer.
 * @returns {ServerlessContainer} The instance of the ServerlessContainer.
 */
export function createServerlessContainer(): ServerlessContainer {
    return new ServerlessContainer();
}
