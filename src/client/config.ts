import { defineClientConfig } from "@vuepress/client";
import I18nTip from "./components/I18nTip.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("I18nTip", I18nTip);
  },
});
