import { getDirname, path } from "@vuepress/utils";
import type { App, Plugin } from "@vuepress/core";
import { getLocales } from "vuepress-shared";
import * as locales from "./locales/index.js";
import type { Page } from "../shared/types.js";
import { type I18nPluginOptions, getOptions } from "./options.js";
import { insertAfterFrontmatter, PLUGIN_NAME } from "./utils/helper.js";
import {
  addPageData,
  fillUntranslatedPages,
  isOutdated,
} from "./utils/index.js";

const __dirname = getDirname(import.meta.url);

const i18nPlugin =
  (_options: I18nPluginOptions = {}): Plugin =>
  (app: App) => {
    const options = getOptions(_options);
    let isInited = false;
    return {
      name: PLUGIN_NAME,
      multiple: false,
      define: {
        I18N_PLUGIN_LOCALES: getLocales({
          app,
          name: PLUGIN_NAME,
          default: locales,
          config: options.locales,
        }),
        I18N_PLUGIN_CONTAINER_CLASS: options.tip.containerClass,
        I18N_PLUGIN_TITLE_CLASS: options.tip.titleClass,
        I18N_PLUGIN_GUIDE_LINK: options.guideLink,
      },
      clientConfigFile: path.resolve(__dirname, "..", "client", "config.js"),
      extendsPage: async (page: Page, app: App) => {
        if (options.filter(page)) {
          if (options.tip.enable) {
            page.content = insertAfterFrontmatter(
              page.content,
              "<i18nTip />\n"
            );
            await addPageData(page, app);
            if (isInited) isOutdated(page, app);
          }
        }
      },
      onInitialized: async (app) => {
        isInited = true;
        await fillUntranslatedPages(app, options);
      },
    };
  };

export default i18nPlugin;
export { PLUGIN_NAME };
