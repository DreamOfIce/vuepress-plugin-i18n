import { App, preparePageData } from "@vuepress/core";
import type { Page } from "../../shared/types.js";
import { isGitRepo, isSourcePage, logger } from "../utils.js";

async function isOutdated(page: Page, app: App) {
  const cwd = app.dir.source();
  if (isGitRepo(cwd) && !isSourcePage(page)) {
    const langPrefix = page.pathLocale;
    const translationPath = page.path;
    const sourcePath = translationPath.replace(langPrefix, "/");
    const sourcePage = (app.pages as Page[]).find((p) => p.path === sourcePath);
    const sourceUpdateTime = sourcePage?.data?.i18n?.updatedTime;
    const translationUpdateTime = page.data.i18n?.updatedTime;
    if (!sourcePage || !sourceUpdateTime || !translationUpdateTime) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    page.data.i18n!.sourceUpdatedTime = sourceUpdateTime;
    if (sourceUpdateTime > translationUpdateTime) {
      if (app.env.isDebug)
        logger("debug", `Out-of-date page detected: ${page.path}`);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      page.data.i18n!.outdated = true;
    }
    await preparePageData(app, page);
  }
}

export { isOutdated };
