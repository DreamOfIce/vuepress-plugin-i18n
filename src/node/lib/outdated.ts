import type { App } from "@vuepress/core";
import type { Page } from "../../shared/types.js";
import type { I18nPluginInternalOptions } from "../options.js";
import { logger } from "../utils.js";

export const markOutDatedPage = (
  page: Page,
  app: App,
  options: I18nPluginInternalOptions
) => {
  if (page.pathLocale !== options.baseLocalePath) {
    const baseLocalePath = page.data.i18n?.sourceLink;
    const sourcePage = (app.pages as Page[]).find(
      (p) => p.path === baseLocalePath
    );
    const sourceUpdateTime = sourcePage?.data.i18n?.updatedTime;
    const translationUpdateTime = page.data.i18n?.updatedTime;
    if (!sourcePage || !sourceUpdateTime || !translationUpdateTime) return;
    page.data.i18n ||= {};
    page.data.i18n.sourceUpdatedTime = sourceUpdateTime;
    if (sourceUpdateTime > translationUpdateTime) {
      if (app.env.isDebug)
        logger.info(`Out-of-date page detected: ${page.path}`);
      page.data.i18n.outdated = true;
      if (options.tag) {
        page.frontmatter.tag ||= [];
        page.frontmatter.tag.push("outdated");
      }
    }
  }
};
