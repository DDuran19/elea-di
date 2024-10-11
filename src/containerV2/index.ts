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

export abstract class ServerlessInjectable {
    static __key__: string = lowercase(this.name || this.constructor.name);
    static __dependencies__: (string | ServerlessInjectable)[];

    constructor() {}
}

export class ServerlessValue {
    constructor(public __value__: any, public __key__: string) {}
}
export class ServerlessContainer {
    private _registeredClasses: Map<
        string,
        new (...args: any[]) => ServerlessInjectable
    > = new Map();

    private _instantiatedClasses: Map<
        string,
        ServerlessInjectable | ServerlessValue
    > = new Map();

    get registeredClasses(): Map<
        string,
        new (...args: any[]) => ServerlessInjectable
    > {
        return this._registeredClasses;
    }

    get instantiatedClasses(): Map<
        string,
        ServerlessInjectable | ServerlessValue
    > {
        return this._instantiatedClasses;
    }

    registerClass(Class: new (...args: any[]) => ServerlessInjectable): this {
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

    registerRuntimeValue(value: any, key: string) {
        const lowercased = lowercase(key);
        const newValue = new ServerlessValue(value, lowercased);
        this._instantiatedClasses.set(lowercased, newValue);
        return this;
    }

    injectRuntimeValue<T = any>(key: string, value: T): T {
        const lowercased = lowercase(key);
        if (!this._instantiatedClasses.has(lowercased)) {
            throw new Error(
                `Value ${key} is not instantiated. Add it to the container. \`container.registerRuntimeValue( {},${key})\`); `
            );
        }
        const instance = this._instantiatedClasses.get(
            lowercased
        ) as ServerlessValue;
        instance.__value__ = value;
        this._instantiatedClasses.set(lowercased, instance);
        return value;
    }

    resolve<T>(
        Class: T
    ): T extends new (...args: any[]) => ServerlessInjectable
        ? InstanceType<T>
        : T {
        const isClass = this._isClass(Class);

        if (!isClass) {
            const value = this._instantiatedClasses.get(
                lowercase(Class as string)
            );
            if (value) {
                return (value as ServerlessValue).__value__;
            }

            throw new Error(
                `Class ${
                    // @ts-expect-error
                    Class.name || Class
                } is not registered in the container`
            );
        }

        // @ts-expect-error
        const dependencies: string[] = Class.__dependencies__;

        const dependenciesInstance =
            dependencies?.map((dep) => {
                const lowercased = lowercase(dep);
                const registered = this._registeredClasses.get(lowercased);
                const instantiated = this._instantiatedClasses.get(lowercased);
                if (!registered && !instantiated) {
                    throw new Error(
                        `Class ${dep} is not registered in the container`
                    );
                }

                if (instantiated) {
                    if (instantiated instanceof ServerlessValue) {
                        return (instantiated as ServerlessValue).__value__;
                    } else {
                        return instantiated;
                    }
                }

                return this.resolve(registered!);
            }) || [];
        return new Class(...dependenciesInstance);
    }

    private _isClass(Class: any): Class is new (...args: any[]) => any {
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
