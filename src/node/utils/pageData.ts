import type { App } from "@vuepress/core";
import { getUpdatedTime } from "@vuepress/plugin-git";
import type { Page } from "../../shared/types";
import { isGitRepo } from "./helper";

const addPageData = async (page: Page, app: App) => {
  const cwd = app.dir.source();

  page.data.i18n ||= {};
  page.data.i18n.localePath = page.pathLocale;
  page.data.i18n.sourceLink = page.path.replace(page.pathLocale, "/");

  if (page.frontmatter["untranslated"]) {
    page.data.i18n.untranslated = true;
  } else if (isGitRepo(cwd) && page.filePathRelative) {
    page.data.i18n.updatedTime =
      page.data["git"]?.["updatedTime"] ??
      (await getUpdatedTime([page.filePathRelative], cwd));
  }
};

export { addPageData };
