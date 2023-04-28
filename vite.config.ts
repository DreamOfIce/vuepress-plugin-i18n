import { access, cp, rm } from "fs/promises";
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
      external: [
        "chokidar",
        "vue",
        /vuepress-share(\/.+)?/,
        /@vuepress\/.+/,
        /@temp\/.+/,
      ],
    },
  },
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      // Fix misplaced dts files after rollup
      afterBuild: async () => {
        await Promise.all(
          Object.keys(entries).map(async (entry) => {
            const src = join(__dirname, "dist", `${basename(entry)}.d.ts`);
            const dest = join(__dirname, "dist", `${entry}.d.ts`);
            try {
              await access(src);
              await cp(src, dest);
              await rm(src);
            } catch (err) {
              if (err instanceof Error)
                console.warn(
                  `Error while moving ${src} to ${dest}: ${err.message}`
                );
            }
          })
        );
      },
    }),
  ],
});
