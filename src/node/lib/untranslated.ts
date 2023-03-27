import { type App, createPage, type Page } from "@vuepress/core";
import { colors } from "@vuepress/utils";
import type { I18nPluginTempFrontmatter } from "../../shared/types.js";
import { isSourcePage, logger } from "../utils.js";

async function fillUntranslatedPages(page: Page, app: App) {
  if (isSourcePage(page)) {
    const siteLocales = app.siteData.locales;
    const translationPrefixs = Object.keys(siteLocales).filter(
      (path) => path !== "/"
    );
    const renderList: Promise<Page>[] = [];

    const pagePaths = app.pages.map((p) => p.path);
    for (const prefix of translationPrefixs) {
      if (pagePaths.includes(page.path.replace("/", prefix))) continue;
      const pageOptions = {
        path: page.path.replace("/", prefix),
        content: page.content,

        frontmatter: {
          ...page.frontmatter,
          _i18n: {
            localePath: prefix,
            untranslated: true,
          } as I18nPluginTempFrontmatter,
        },
      };
      if (page.filePathRelative) {
        pageOptions.frontmatter._i18n.filePathRelative = `${prefix.slice(1)}${
          page.filePathRelative
        }`;
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
    app.pages.push(...(await Promise.all(renderList)));
  }
}

export { fillUntranslatedPages };
