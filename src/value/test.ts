import container from "../container/index.js";
import Injectable from "../injectable/index.js";
import value from "./index.js";
import { describe, expect, it } from "vitest";

describe("Value class", () => {
    const connectionString = value("db://localhost:27017");
    const mySchema = value({
        foo: "string",
        baz: "string",
    });

    class MyService extends Injectable {
        static _dependencies = [connectionString, mySchema];

        constructor(
            private readonly _connectionString: string,
            private readonly schema: typeof mySchema
        ) {
            super();
        }

        confirm() {
            return true;
        }
        get connectionString() {
            return this._connectionString;
        }
    }

    function outsideScope() {
        const age = value(21, "edi-age");
        return age;
    }

    class Person extends Injectable {
        static _dependencies = ["edi-age"];

        constructor(readonly age: number) {
            super();
        }
    }
    it("should instantiate the service", () => {
        const service = container.register(MyService).resolve(MyService);

        expect(service).toBeInstanceOf(MyService);
        expect(service.confirm()).toBe(true);
        expect(service.connectionString).toBe(connectionString);
    });

    it("should instantiate a class whose dependencies are on different scope", () => {
        const age = outsideScope();
        const person = container.register(Person).resolve(Person);
        expect(person).toBeInstanceOf(Person);
        expect(person.age).toBe(21);
    });
});
