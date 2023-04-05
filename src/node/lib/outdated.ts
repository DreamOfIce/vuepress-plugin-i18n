import type { App } from "@vuepress/core";
import type { Page } from "../../shared/types.js";
import type { I18nPluginInternalOptions } from "../options.js";
import { isGitRepo, logger } from "../utils.js";

const isOutdated = (
  page: Page,
  app: App,
  options: I18nPluginInternalOptions
) => {
  const cwd = app.dir.source();
  if (isGitRepo(cwd) && page.pathLocale !== options.sourcePath) {
    const langPrefix = page.pathLocale;
    const translationPath = page.path;
    const sourcePath = translationPath.replace(langPrefix, options.sourcePath);
    const sourcePage = (app.pages as Page[]).find((p) => p.path === sourcePath);
    const sourceUpdateTime = sourcePage?.data.i18n?.updatedTime;
    const translationUpdateTime = page.data.i18n?.updatedTime;
    if (!sourcePage || !sourceUpdateTime || !translationUpdateTime) return;
    page.data.i18n ||= {};
    page.data.i18n.sourceUpdatedTime = sourceUpdateTime;
    if (sourceUpdateTime > translationUpdateTime) {
      if (app.env.isDebug)
        logger("debug", `Out-of-date page detected: ${page.path}`);
      page.data.i18n.outdated = true;
      if (options.tag) {
        page.frontmatter.tag ||= [];
        page.frontmatter.tag.push("outdated");
      }
    }
  }
};

export { isOutdated };
