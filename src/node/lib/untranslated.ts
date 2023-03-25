import {
  type App,
  createPage,
  type Page,
  PageFrontmatter,
} from "@vuepress/core";
import { colors } from "@vuepress/utils";
import { isSourcePage, logger } from "../utils.js";
import type { I18nPluginInternalOptions } from "../options.js";

async function fillUntranslatedPages(
  app: App,
  options: I18nPluginInternalOptions
) {
  const siteLocales = app.siteData.locales;
  const translationPrefixs = Object.keys(siteLocales).filter(
    (path) => path !== "/"
  );
  const renderList: Promise<Page>[] = [];

  for (const page of app.pages) {
    if (isSourcePage(page) && options.filter(page)) {
      const pagePaths = app.pages.map((p) => p.path);
      for (const prefix of translationPrefixs) {
        if (pagePaths.includes(page.path.replace("/", prefix))) continue;
        const pageOptions = {
          path: page.path.replace("/", prefix),
          content: page.content,

          frontmatter: {
            ...page.frontmatter,
            untranslated: true,
          } as PageFrontmatter,
        };
        if (page.filePathRelative) {
          Object.assign(pageOptions, {
            filePath: app.dir.source(
              `${prefix.slice(1)}${page.filePathRelative}`
            ),
          });
        }

        renderList.push(createPage(app, pageOptions));
        if (app.env.isDebug)
          logger(
            "debug",
            `Fill page ${colors.green(
              pageOptions.path
            )} with original ${colors.green(page.path)}`
          );
      }
    }
  }
  app.pages.push(...(await Promise.all(renderList)));
}

export { fillUntranslatedPages };
