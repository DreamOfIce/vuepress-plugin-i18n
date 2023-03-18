import { createPage, PageFrontmatter } from "@vuepress/core";
import type { App, Page } from "@vuepress/core";
import {
  chooseLocaleData,
  createContainer,
  getLanguage,
  insertAfterFrontmatter,
  isSourcePage,
} from "./helper.js";
import type { i18nPluginInternalOptions } from "../options.js";

async function fillUntranslatedPages(
  app: App,
  options: i18nPluginInternalOptions
) {
  const siteLocales = app.siteData.locales;
  const translationPrefixs = Object.keys(siteLocales).filter(
    (path) => path !== "/"
  );
  const renderList: Promise<Page>[] = [];
  for (const page of app.pages) {
    if (!isSourcePage(page, translationPrefixs)) continue;
    const pagePaths = app.pages.map((p) => p.path);
    for (const prefix of translationPrefixs) {
      if (pagePaths.includes(page.path.replace("/", prefix))) continue;
      const pageOptions = {
        path: page.path.replace("/", prefix),
        content: page.content,
        frontmatter: {
          ...page.frontmatter,
          untranslated: true,
          lang: options.locales["/"]?.lang ?? app.siteData.lang,
        } as PageFrontmatter,
      };
      if (options.addTag) {
        pageOptions.frontmatter["tag"] ||= [];
        (pageOptions.frontmatter["tag"] as Array<string>).push("untranslated");
      }
      if (options.addTips) {
        const { untranslated } = chooseLocaleData(
          app.siteData,
          options.locales,
          pageOptions.path,
          getLanguage(pageOptions.path, translationPrefixs)
        );
        pageOptions.content = insertAfterFrontmatter(
          pageOptions.content,
          createContainer(
            "tip",
            untranslated.title,
            untranslated.content(options.guideLink?.replace("/", prefix))
          )
        );
      }
      renderList.push(createPage(app, pageOptions));
    }
  }
  app.pages.push(...(await Promise.all(renderList)));
}

export { fillUntranslatedPages };
