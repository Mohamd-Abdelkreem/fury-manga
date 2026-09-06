import { createNextConfig } from "@fury/eslint-config/next";

const config = [
  ...createNextConfig({
    tsconfigRootDir: import.meta.dirname,
    allowDefaultProject: ["vitest.config.ts"],
  }),
  {
    name: "fury/reference-ui-compatibility",
    files: [
      "src/app/page.tsx",
      "src/app/discover/**/*.{ts,tsx}",
      "src/app/story/**/*.{ts,tsx}",
      "src/components/shared/**/*.{ts,tsx}",
      "src/components/ui/**/*.{ts,tsx}",
      "src/features/discover/**/*.{ts,tsx}",
      "src/features/home/**/*.{ts,tsx}",
      "src/features/story/**/*.{ts,tsx}",
    ],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-deprecated": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
