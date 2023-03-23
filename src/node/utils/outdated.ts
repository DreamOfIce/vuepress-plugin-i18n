import type { App } from "@vuepress/core";
import type { Page } from "../../shared/types.js";
import { isGitRepo, isSourcePage, logger } from "./helper.js";

function isOutdated(page: Page, app: App) {
  const cwd = app.dir.source();
  if (isGitRepo(cwd) && !isSourcePage(page)) {
    const langPrefix = page.pathLocale;
    const translationPath = page.path;
    const sourcePath = translationPath.replace(langPrefix, "/");
    const sourcePage = app.pages.find((p) => p.path === sourcePath) as Page;
    const sourceUpdateTime = sourcePage.data.i18n?.updatedTime;
    const translationUpdateTime = page.data.i18n?.updatedTime;
    if (!sourceUpdateTime || !translationUpdateTime) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    page.data.i18n!.sourceUpdatedTime = sourceUpdateTime;
    if (sourceUpdateTime > translationUpdateTime) {
      if (app.env.isDebug)
        logger("debug", `Out-of-date page detected: ${page.path}`);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      page.data.i18n!.outdated = true;
    }
  }
}

export { isOutdated };
