import { getDirname, path } from "@vuepress/utils";
import type { App, Plugin } from "@vuepress/core";
import type { Page } from "../shared/types";
import { type I18nPluginOptions, getOptions } from "./options";
import { getLocales, insertAfterFrontmatter, PLUGIN_NAME } from "./utils";
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
        I18N_PLUGIN_LOCALES: getLocales(app.siteData, options.locales),
        I18N_PLUGIN_CONTAINER_CLASS: options.tip.containerClass,
        I18N_PLUGIN_TITLE_CLASS: options.tip.titleClass,
        I18N_PLUGIN_GUIDE_LINK: options.guideLink,
      },
      clientConfigFile: path.resolve(__dirname, "..", "client", "config.js"),
      extendsPage: async (page: Page, app: App) => {
        if (options.filter(page) || page.frontmatter["generatedByI18n"]) {
          await addPageData(page, cwd);
          if (isInited) isOutdated(page, app);
          if (options.tip.enable) {
            page.content = insertAfterFrontmatter(
              page.content,
              "<i18nTip />\n"
            );
          }
        }
      },
      onInitialized: async (app) => {
        isInited = true;
        await Promise.all(
          app.pages.map(async (page) => {
            if (options.filter(page)) {
              isOutdated(page, app);
              await fillUntranslatedPages(page, app);
            }
          })
        );
      },
      onPrepared: async (app) =>
        await writeLocales(app, getLocales(app.siteData, locales)),
    };
  };

export default i18nPlugin;
export { PLUGIN_NAME };
