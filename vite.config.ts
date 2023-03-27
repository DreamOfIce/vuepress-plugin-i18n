import { cp, rm } from "fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const entries = {
  ["node/index"]: "src/node/index.ts",
  ["client/config"]: "src/client/config.ts",
};

export default defineConfig({
  build: {
    lib: {
      entry: entries,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue", /@vuepress\/.+/, "vuepress-shared", /@temp\/.+/],
    },
  },
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      // Fix misplaced type after rolluo
      afterBuild: async () => {
        await Promise.all(
          Object.keys(entries).map(async (entry) => {
            const source = join(__dirname, "dist", `${basename(entry)}.d.ts`);
            const dest = join(__dirname, "dist", `${entry}.d.ts`);
            await cp(source, dest);
            await rm(source);
          })
        );
      },
    }),
  ],
});
