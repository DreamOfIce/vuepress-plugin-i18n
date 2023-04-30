import { getDirname, path } from "@vuepress/utils";
import {
  preparePageData,
  type App,
  type Plugin,
  preparePagesComponents,
} from "@vuepress/core";
import { watch } from "chokidar";
import type { Page } from "../shared/types.js";
import { type I18nPluginOptions, getOptions } from "./options.js";
import {
  addComponent,
  getLocales,
  getPageFromDataFilePath,
  PLUGIN_NAME,
} from "./utils.js";
import {
  addPageData,
  fillUntranslatedPages,
  markOutdatedPage,
  writeLocales,
} from "./lib/index.js";
import locales from "./locales/index.js";

const __dirname = getDirname(import.meta.url);

export const i18nPlugin =
  (_options: I18nPluginOptions = {}): Plugin =>
  (app: App) => {
    const options = getOptions(app, _options);
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
          await addPageData(page, app, options);
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
      onWatched: (app, watcher) => {
        const pageWatcher = watch("pages/**/*.js", {
          cwd: app.dir.temp(),
          ignoreInitial: true,
        });
        pageWatcher.on("change", (filePath) => {
          const page: Page | undefined = getPageFromDataFilePath(app, filePath);
          if (page && page.data.i18n?.updatedTime) {
            app.pages.forEach((p: Page) => {
              if (p.data.i18n?.sourceLink === page.path && p.data.i18n)
                p.data.i18n.sourceUpdatedTime = page.data.i18n!.updatedTime!;
              void preparePageData(app, page);
            });
          }
        });

        //  Remove filled page if source has been removed
        pageWatcher.on("unlink", (filePath) => {
          const { path, pathLocale } =
            getPageFromDataFilePath(app, filePath) ?? {};
          if (pathLocale === options.baseLocalePath && path) {
            const pageCount = app.pages.length;
            app.pages = app.pages.filter(
              (page: Page) =>
                !(
                  page.path ===
                    path.replace(options.baseLocalePath, page.pathLocale) &&
                  page.data.i18n?.untranslated
                )
            );
            // Re-prepare only if some pages are removed
            if (app.pages.length < pageCount) void preparePagesComponents(app);
          }
        });
        watcher.push(pageWatcher);
      },
    };
  };
