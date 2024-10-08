import { beforeEach, describe, expect, it, afterEach, vi } from "vitest";
import Singleton from "./index";

// Mock subclasses for testing
class MockSingleton extends Singleton {
    public name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
    sayHi() {
        return this.name + " says hi!";
    }
}

class MockSingleton2 extends Singleton {
    public name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
    sayHi() {
        return this.name;
    }
}

class MockSingleton3 extends MockSingleton2 {
    public name: string;
    constructor(name: string) {
        super(name);
        this.name = name;
    }
    sayHi() {
        return `Hello, ${this.name}!`;
    }
}

describe("Singleton", () => {
    const name = "Elea";

    beforeEach(() => {
        Singleton.singletons.clear();
    });

    describe("Instance Management", () => {
        it("should create unique instances for different subclasses", () => {
            const instance1 = Singleton.getInstance(MockSingleton, name);
            const instance2 = Singleton.getInstance(MockSingleton2, name);
            const instance3 = Singleton.getInstance(MockSingleton3, name);
            expect(instance1).not.toBe(instance2);
            expect(instance1).not.toBe(instance3);
            expect(instance2).not.toBe(instance3);
        });

        it("should return the same instance for multiple calls", () => {
            const instance1 = Singleton.getInstance(MockSingleton, name);
            const instance2 = Singleton.getInstance(
                MockSingleton,
                "Dependency Injection"
            );
            const instance3 = Singleton.getInstance(
                MockSingleton,
                "Inversion of Control"
            );

            expect(instance1).toBe(instance2);
            expect(instance1).toBe(instance3);

            expect(instance2.name).toBe(name);
            expect(instance3.name).toBe(name);
        });

        it("should not create a new instance for an existing class", () => {
            const existingInstance = Singleton.getInstance(MockSingleton, 30);
        });
    });

    describe("Instance Tracking", () => {
        it("should track existing instances correctly", () => {
            expect(Singleton.has(MockSingleton)).toBe(true);
            expect(Singleton.has(MockSingleton2)).toBe(true);
            expect(Singleton.has(class NonExistentSingleton {})).toBe(false);
        });

        it("should correctly retrieve instances via the 'get' method", () => {
            const instance1 = Singleton.getInstance(MockSingleton, name);
            const instance2 = Singleton.getInstance(MockSingleton2, name);
            const instance3 = Singleton.getInstance(MockSingleton3, name);
            expect(Singleton.get(MockSingleton)).toBe(instance1);
            expect(Singleton.get(MockSingleton2)).toBe(instance2);
            expect(Singleton.get(MockSingleton3)).toBe(instance3);
        });

        it("should return all singleton instances", () => {
            const instancesMap = Singleton.singletons;
            expect(instancesMap.size).toBe(0);

            const instance1 = Singleton.getInstance(MockSingleton, name);
            const instance2 = Singleton.getInstance(MockSingleton2, name);
            const instance3 = Singleton.getInstance(MockSingleton3, name);
            expect(instancesMap.size).toBe(3);
            expect(instancesMap.get(MockSingleton)).toBe(instance1);
            expect(instancesMap.get(MockSingleton2)).toBe(instance2);
            expect(instancesMap.get(MockSingleton3)).toBe(instance3);
        });
    });
});
