import container from "../container/index.js";
import Injectable from "../injectable/index.js";
import value from "./index.js";
import { describe, expect, it } from "vitest";

function reallyOutsideScope() {
    const name = value(
        {
            first: "Elea",
            last: "Duran",
        },
        "edi-name"
    );
    return name;
}

class Service extends Injectable {
    static _dependencies = ["edi-service"];

    constructor(readonly service: string) {
        super();
    }
}

function functionAndServiceIsOutside() {
    const service = () => value("db://localhost:27017", "edi-service");

    const deepNestedFunction = function () {
        return service();
    };

    return deepNestedFunction();
}
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

    class Baby extends Injectable {
        static _dependencies = ["edi-name"];

        constructor(readonly name: string) {
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
        outsideScope();
        const person = container.register(Person).resolve(Person);
        expect(person).toBeInstanceOf(Person);
        expect(person.age).toBe(21);

        reallyOutsideScope();
        const baby = container.register(Baby).resolve(Baby);
        expect(baby).toBeInstanceOf(Baby);
        expect(baby.name).toStrictEqual({
            first: "Elea",
            last: "Duran",
        });

        const outsideFunctionAndService = functionAndServiceIsOutside();
        const service = container.register(Service).resolve(Service);
        expect(service).toBeInstanceOf(Service);
        expect(service.service).toBe("db://localhost:27017");
    });
});
