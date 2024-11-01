/// <reference types="vite/client" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { libInjectCss } from "vite-plugin-lib-inject-css";
// vite library mode로 만들기 위한 라이브러리. *.d.ts .tsx 타입의 파일을 생성해줌
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
      // 외부 종속성
      external: ["react", "react-dom", "react/jsx-runtime"],
      // https://rollupjs.org/configuration-options/#input
      // entry point를 지정
      /** 
       * {
          main: '/Users/sanghalee/Documents/infludeo/infludeo-component-test/src/main.ts',
          'components/MyTitle/index': 
            '/Users/sanghalee/Documents/infludeo/infludeo-component-test/src/components/MyTitle/index.tsx',
          'components/MyButton/index': 
            '/Users/sanghalee/Documents/infludeo/infludeo-component-test/src/components/MyButton/index.tsx'
          }
       * 
       */
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
        // main.js , components/MyTitle/index.js , components/MyButton/index.js 형태의 output 생성
        entryFileNames: "[name].js",
        // https://rollupjs.org/configuration-options/#output-assetfilenames
        assetFileNames: "assets/[name][extname]",
        // 외부 의존성 명시
        globals: {
          react: "React",
          "react-dom": "React-dom",
          "react/jsx-runtime": "react/jsx-runtime",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
