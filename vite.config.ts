import type { UserConfig } from "vite";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default {
  build: {
    // Do not include assets from the testbed
    copyPublicDir: false,
    // Include sourcemaps
    sourcemap: true,
    // Configure to be built as a library for publishing https://vite.dev/guide/build#library-mode
    lib: {
      entry: resolve(import.meta.dirname, "src/main.js"),
      name: "OnboardingSDK",
      fileName: "onboarding-sdk",
    },
  },
  plugins: [tailwindcss()],
} satisfies UserConfig;
