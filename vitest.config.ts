import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}", "**/test.ts"],
        reporters: "verbose",
        globals: true,
        sequence: {
            concurrent: true,
        },
    },
});
