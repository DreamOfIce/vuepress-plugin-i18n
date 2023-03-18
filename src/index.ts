import type { Plugin } from "@vuepress/core";
import { type i18nPluginOptions, defaultOptions } from "./options.js";
import { addOutdatedTips, fillUntranslatedPages } from "./utils/index.js";

const i18nPlugin = (_options: i18nPluginOptions = {}): Plugin => {
  const options = { ...defaultOptions, ..._options };
  return {
    name: "vuepress-plugin-i18n",
    multiple: false,
    onInitialized: async (app) => {
      await addOutdatedTips(app, options);
      await fillUntranslatedPages(app, options);
    },
  };
};
export default i18nPlugin;
