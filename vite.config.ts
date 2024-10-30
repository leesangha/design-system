/// <reference types="vite/client" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import dts from "vite-plugin-dts";
import { globSync } from "glob";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), libInjectCss(), dts()],
  build: {
    lib: { entry: resolve(__dirname, "src/main.ts"), formats: ["es"] },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      // https://rollupjs.org/configuration-options/#input
      input: Object.fromEntries(
        globSync(["src/components/**/index.tsx", "src/main.ts"]).map(
          (file: any) => {
            const entryName = path.relative(
              "src",
              file.slice(0, file.length - path.extname(file).length)
            );

            const entryUrl = fileURLToPath(new URL(file, import.meta.url));
            return [entryName, entryUrl];
          }
        )
      ),
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]",
        globals: {
          react: "React",
          "react-dom": "React-dom",
          "react/jsx-runtime": "react/jsx-runtime",
        },
      },
    },
  },
});
