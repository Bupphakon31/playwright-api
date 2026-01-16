import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./testCases",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: "html",
    use: {
        trace: "on-first-retry",
        headless: false,
    },

    projects: [
        {
            name: "default",
        },
    ],
});
