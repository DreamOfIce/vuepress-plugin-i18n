import { defineClientConfig } from "@vuepress/client";
import type { Component } from "vue";
import i18nTipComponent from "./components/i18nTip.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("I18nTip", i18nTipComponent as Component);
  },
});
