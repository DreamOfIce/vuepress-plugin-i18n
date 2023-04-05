import { getDirname, path } from "@vuepress/utils";
import { App, Plugin, preparePagesData } from "@vuepress/core";
import type { Page } from "../shared/types";
import { type I18nPluginOptions, getOptions } from "./options";
import { addTipComponent, getLocales, PLUGIN_NAME } from "./utils";
import {
  addPageData,
  fillUntranslatedPages,
  isOutdated,
  writeLocales,
} from "./lib";
import locales from "./locales";

const __dirname = getDirname(import.meta.url);

const i18nPlugin =
  (_options: I18nPluginOptions = {}): Plugin =>
  (app: App) => {
    const options = getOptions(_options);
    const cwd = app.dir.source();
    let isInited = false;

    return {
      name: PLUGIN_NAME,
      multiple: false,
      define: {
        I18N_PLUGIN_CONTAINER_CLASS: options.tip.containerClass,
        I18N_PLUGIN_SOURCE_PREFIX: options.sourcePath,
        I18N_PLUGIN_TITLE_CLASS: options.tip.titleClass,
      },
      clientConfigFile: path.resolve(__dirname, "..", "client", "config.js"),
      extendsPage: async (page: Page, app: App) => {
        if (options.filter(page) || page.frontmatter["_i18n"]) {
          await addPageData(page, cwd, options);
          if (isInited) isOutdated(page, app, options);
          if (options.tip.enable) addTipComponent(page);
        }
      },
      onInitialized: async (app) => {
        isInited = true;
        await Promise.all(
          app.pages.map(async (page) => {
            if (options.filter(page)) {
              isOutdated(page, app, options);
              await fillUntranslatedPages(page, app, options);
            }
          })
        );
        await preparePagesData(app);
      },
      onPrepared: async (app) =>
        await writeLocales(app, getLocales(app.siteData, locales), options),
    };
  };

export default i18nPlugin;
export { PLUGIN_NAME };
