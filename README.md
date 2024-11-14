# Yatu Component Readme

### Npm publish를 위한 기본 설정

1. vite.config.ts

```jsx
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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

1. package.json

```jsx
{ // ...
  "name": "yatu-component",
  "private": false, -> npm publish를 위한 false
  "version": "0.0.3", -> publish 시에 version 변경 필요
  "type": "module", -> build 타입 module로 정의
  "scripts": {
    "build": "tsc -b && vite build", -> vite 번들러 사용해서 빌드, 설정은 vite.config.ts
    "lint": "eslint .",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "module": "./dist/main.js", -> build 모듈의 main 코드 지정
  "exports": "./dist/main.js", -> build 시 생성파일 지정
  "files": [
    "dist"
  ], -> 빌드 디렉토리 지정
  "types": "./dist/main.d.ts", -> 타입스크립트 정의 파일 명시
  "sideEffects": [
    "**/*.css"
  ], -> ???
  // ...
  }
```

1. tsconfig.json

```jsx
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "incremental": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}

```

---

### Figma 디자인 토큰을 활용한 코드 연동

→ [레퍼런스](https://velog.io/@seo__namu/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%EC%97%90-%EB%94%94%EC%9E%90%EC%9D%B8-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)

→ [style-dictionary reference](https://amzn.github.io/style-dictionary/#/)

개요

1. figma 토큰 변경 후 push
2. push 이벤트 감지 후 github action을 통한 토큰 업데이트 및 pr
3. token merge
4. npx style-dictionary build
5. 이후 style-dictionary로 index.css 갱신 후 version 업데이트를 포함한 pr생성 (Manual 작업)
6. 스타일 변수 변경점 PR merge
7. npm publish

- 토큰 사용 예시
  → npm publish example
  → [https://www.npmjs.com/package/yatu-component](https://www.npmjs.com/package/yatu-component)
  → Figma 에서 사용되는 디자인 시스템을 token화 시켜서 github actions를 통해 PR 생성
  → 네이밍 규칙 정돈 후 연동 예정
  → 토큰의 메인키 이름은 중복이 불가능합니다. 토큰 추출에 대한 약속된 네이밍을 통해서 변경점들을 적용해야함
  → shadcn의 경우 컬러 팔레트 같은 부분들을 slice 후 변경이 아니라 팔레트 직접 변경을 통해서 네이밍을 기존 네이밍과 일치시켜야함

  ```jsx
  // token example
  {
    "colorPalette": {
      // ...
    },
    "shadcnUiTheme": {
      "background": { "mode1": "#ffffff" },
      "foreground": { "mode1": "#030712" },
      "muted": { "mode1": "#f3f4f6" },
      "mutedForeground": { "mode1": "#6b7280" },
      "card": { "mode1": "#ffffff" },
      "cardForeground": { "mode1": "#030712" },
      "popover": { "mode1": "#ffffff" },
      "popoverForeground": { "mode1": "#030712" },
      "border": { "mode1": "#e5e7eb" },
      "input": { "mode1": "#e5e7eb" },
      "primary": { "mode1": "#111827" },
      "primaryForeground": { "mode1": "#f9fafb" },
      "secondary": { "mode1": "#f3f4f6" },
      "secondaryForeground": { "mode1": "#111827" },
      "acce": { "mode1": "#f3f4f6" },
      "acceForeground": { "mode1": "#111827" },
      "destructive": { "mode1": "#ef4444" },
      "destructiveForeground": { "mode1": "#f9fafb" },
      "ring": { "mode1": "#6b7280" },
      "acceBlue": { "mode1": "#2563eb" },
      "acceGreen": { "mode1": "#16a34a" }
    }
  }

  ```

  → ~~생성된 토큰을 기반으로 스타일시트를 구성할 수 있도록, style-dictionary 또는 Token Transformer를 사용하여 연동~~
  → ~~shadcn 컴포넌트와 연동하는 작업 필요~~
  → Token Transformer (X) , style-dictionary(O)

  ```jsx
  {
    "background": {
      "value": "{white}",
      "type": "color"
    },
    "foreground": {
      "value": "{gray.950}",
      "type": "color"
    },
    "muted": {
      "background": {
        "value": "{gray.100}",
        "type": "color"
      },
      "foreground": {
        "value": "{gray.500}",
        "type": "color"
      }
    },
    "card": {
      "background": {
        "value": "{white}",
        "type": "color"
      },
      "foreground": {
        "value": "{gray.950}",
        "type": "color"
      }
    },
    "primary": {
      "primary": {
        "value": "{gray.900}",
        "type": "color"
      },
      "foreground": {
        "value": "{gray.50}",
        "type": "color"
      }
    },
    "secondary": {
      "secondary": {
        "value": "{gray.100}",
        "type": "color"
      },
      "foreground": {
        "value": "{gray.900}",
        "type": "color"
      }
    },
    "border": {
      "border": {
        "value": "{gray.200}",
        "type": "color"
      }
    },
    "destructive": {
      "destructive": {
        "value": "{red.500}",
        "type": "color"
      },
      "foreground": {
        "value": "{gray.50}",
        "type": "color"
      }
    },
    "ring": {
      "ring": {
        "value": "{gray.500}",
        "type": "color"
      }
    },
    "accent": {
      "background": {
        "normal": {
          "value": "{gray.100}",
          "type": "color"
        },
        "red": {
          "value": "{red.50}",
          "type": "color"
        },
        "amber": {
          "value": "{amber.50}",
          "type": "color"
        },
        "green": {
          "value": "{green.50}",
          "type": "color"
        },
        "blue": {
          "value": "{blue.50}",
          "type": "color"
        },
        "violet": {
          "value": "{violet.50}",
          "type": "color"
        }
      },
      "foreground": {
        "normal": {
          "value": "{gray.900}",
          "type": "color"
        },
        "red": {
          "value": "{red.600}",
          "type": "color"
        },
        "amber": {
          "value": "{amber.600}",
          "type": "color"
        },
        "green": {
          "value": "{green.600}",
          "type": "color"
        },
        "blue": {
          "value": "{blue.600}",
          "type": "color"
        },
        "violet": {
          "value": "{violet.600}",
          "type": "color"
        }
      }
    }
  }

  ```

  결과

  ```jsx
  :root {
    --background: #ffffff;
    --foreground: #030712;
    --muted-background: #f3f4f6;
    --muted-foreground: #6b7280;
    --card-background: #ffffff;
    --card-foreground: #030712;
    --primary-primary: #111827;
    --primary-foreground: #f9fafb;
    --secondary-secondary: #f3f4f6;
    --secondary-foreground: #111827;
    --border-border: #e5e7eb;
    --destructive-destructive: #ef4444;
    --destructive-foreground: #f9fafb;
    --ring-ring: #6b7280;
    --accent-background-normal: #f3f4f6;
    --accent-background-red: #fef2f2;
    --accent-background-amber: #fffbeb;
    --accent-background-green: #f0fdf4;
    --accent-background-blue: #eff6ff;
    --accent-background-violet: #f5f3ff;
    --accent-foreground-normal: #111827;
    --accent-foreground-red: #dc2626;
    --accent-foreground-amber: #d97706;
    --accent-foreground-green: #16a34a;
    --accent-foreground-blue: #2563eb;
    --accent-foreground-violet: #7c3aed;
    }
  ```
