import { defineClientConfig } from "@vuepress/client";
import i18nTipComponent from "./components/i18nTip.vue";

export default defineClientConfig({
  enhance({ app }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    app.component("i18nTip", i18nTipComponent);
  },
});
