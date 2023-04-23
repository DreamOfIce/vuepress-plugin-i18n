import {
  type App,
  createPage,
  type Page,
  type PageFrontmatter,
} from "@vuepress/core";
import { colors } from "@vuepress/utils";
import type { I18nPluginFrontmatter } from "../../shared/types.js";
import type { I18nPluginInternalOptions } from "../options.js";
import { logger } from "../utils.js";

const fillUntranslatedPages = async (
  page: Page,
  app: App,
  options: I18nPluginInternalOptions
) => {
  if (page.pathLocale === options.baseLocalePath) {
    const siteLocales = app.siteData.locales;
    const translationPrefixs = Object.keys(siteLocales).filter(
      (path) => path !== options.baseLocalePath
    );
    const renderList: Promise<Page>[] = [];

    const pagePaths = app.pages.map((p) => p.path);
    for (const prefix of translationPrefixs) {
      if (pagePaths.includes(page.path.replace(options.baseLocalePath, prefix)))
        continue;
      const pageOptions = {
        path: page.path.replace(options.baseLocalePath, prefix),
        content: page.content,
        frontmatter: {
          ...page.frontmatter,
          _i18n: {
            pathLocale: prefix,
            untranslated: true,
          },
        } as PageFrontmatter<I18nPluginFrontmatter>,
      };
      pageOptions.frontmatter._i18n ||= {};
      if (page.filePathRelative) {
        pageOptions.frontmatter._i18n.filePathRelative = `${prefix.slice(1)}${
          page.filePathRelative
        }`;
      }
      if (options.tag) {
        pageOptions.frontmatter.tag ||= [];
        pageOptions.frontmatter.tag.push("untranslated");
      }
      renderList.push(createPage(app, pageOptions));
      if (app.env.isDebug)
        logger.info(
          `Fill page ${colors.green(
            pageOptions.path
          )} with source ${colors.green(page.path)}`
        );
    }
    app.pages.push(...(await Promise.all(renderList)));
  }
};

export { fillUntranslatedPages };
