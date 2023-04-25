import { getDirname, path } from "@vuepress/utils";
import type { App, Plugin } from "@vuepress/core";
import type { Page } from "../shared/types.js";
import { type I18nPluginOptions, getOptions } from "./options.js";
import { addComponent, getLocales, PLUGIN_NAME } from "./utils.js";
import {
  addPageData,
  fillUntranslatedPages,
  markOutdatedPage,
  writeLocales,
} from "./lib/index.js";
import locales from "./locales/index.js";

const __dirname = getDirname(import.meta.url);

const i18nPlugin =
  (_options: I18nPluginOptions = {}): Plugin =>
  (app: App) => {
    const options = getOptions(app, _options);
    const cwd = app.dir.source();
    let isInited = false;

    return {
      name: PLUGIN_NAME,
      define: {
        I18N_PLUGIN_CONTAINER_CLASS: options.tip.containerClass,
        I18N_PLUGIN_BASE_LOCALE_PATH: options.baseLocalePath,
        I18N_PLUGIN_TITLE_CLASS: options.tip.titleClass,
      },
      clientConfigFile: path.resolve(__dirname, "../client/config.js"),
      extendsPage: async (page: Page, app: App) => {
        if (options.filter(page) || page.frontmatter["_i18n"]) {
          if (options.tip.enable) addComponent(app, page, "I18nTip");
          await addPageData(page, cwd, options);
          if (isInited) markOutdatedPage(page, app, options);
        }
      },
      onInitialized: async (app) => {
        isInited = true;
        await Promise.all(
          app.pages.map(async (page) => {
            if (options.filter(page)) {
              markOutdatedPage(page, app, options);
              await fillUntranslatedPages(page, app, options);
            }
          })
        );
      },
      onPrepared: async (app) =>
        await writeLocales(app, getLocales(app.siteData, locales), options),
    };
  };

export default i18nPlugin;
export { PLUGIN_NAME };
