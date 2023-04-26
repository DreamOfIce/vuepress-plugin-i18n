import type { App } from "vuepress";
import { getUpdateTime } from "./getUpdateTime.js";
import type { I18nPluginFrontmatter, Page } from "../../shared/types.js";
import type { I18nPluginInternalOptions } from "../options.js";

export const addPageData = async (
  page: Page,
  app: App,
  options: I18nPluginInternalOptions
) => {
  const i18nFrontmatter = (page.frontmatter as I18nPluginFrontmatter)["_i18n"];
  if (i18nFrontmatter?.pathLocale) page.pathLocale = i18nFrontmatter.pathLocale;

  page.data.i18n ||= {
    pathLocale: page.pathLocale,
    sourceLink: page.path.replace(page.pathLocale, options.baseLocalePath),
    untranslated: i18nFrontmatter?.untranslated ?? false,
  };

  delete page.frontmatter["_i18n"];

  page.data.i18n.updatedTime = await getUpdateTime(page, app, options);

  if (i18nFrontmatter?.filePathRelative)
    page.filePathRelative = i18nFrontmatter.filePathRelative;
};
