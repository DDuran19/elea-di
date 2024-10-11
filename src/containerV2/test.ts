import { describe, it, expect, beforeEach } from "vitest";
import {
    createServerlessContainer,
    ServerlessContainer,
    ServerlessInjectable,
} from "./index";

describe("ServerlessContainer", () => {
    it("should instantiate the container", () => {
        const container = createServerlessContainer();

        const connectionString = container.registerRuntimeValue(
            "db://localhost:27017",
            "connectionString"
        );
        class MyService extends ServerlessInjectable {
            static __dependencies__: string[] = ["myRepository"];

            constructor(public readonly myRepository: MyRepository) {
                super();
            }
        }

        class MyRepository extends ServerlessInjectable {
            static __dependencies__: string[] = ["connectionString"];
            constructor(private connectionString: string) {
                super();
            }
        }

        container.registerClass(MyService).registerClass(MyRepository);
        console.log({
            classes: container.registeredClasses,
        });

        const service = container.resolve(MyService);

        expect(service).toBeInstanceOf(MyService);
        expect(service.myRepository).toBeInstanceOf(MyRepository);

        expect(1).toBe(1);
    });
});
