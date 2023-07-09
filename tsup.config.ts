import vuePlugin from "esbuild-plugin-vue3";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "node/index": "src/node/index.ts",
    "client/index": "src/client/index.ts",
    "client/config": "src/client/config.ts",
  },
  target: "node16",
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: [
    "chokidar",
    "vue",
    /vuepress-share(\/.+)?/,
    /@vuepress\/.+/,
    /@temp\/.+/,
  ],
  esbuildPlugins: [vuePlugin()],
});
