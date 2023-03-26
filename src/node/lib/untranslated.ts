import {
  type App,
  createPage,
  type Page,
  PageFrontmatter,
} from "@vuepress/core";
import { colors } from "@vuepress/utils";
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
          untranslated: true,
          generatedByI18n: true,
        } as PageFrontmatter,
      };
      if (page.filePathRelative) {
        pageOptions.frontmatter["filePathRelative"] = `${prefix.slice(1)}${
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
