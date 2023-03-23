import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        ["node/index"]: "src/node/index.ts",
        ["client/config"]: "src/client/config.ts",
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue", /@vuepress\/(.)+/, "vuepress-shared"],
    },
  },
  plugins: [vue(), dts()],
});
