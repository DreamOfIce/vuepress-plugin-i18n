import { getUpdatedTime } from "@vuepress/plugin-git";
import type { Page } from "../../shared/types";
import { isGitRepo } from "../utils";

const addPageData = async (page: Page, cwd: string) => {
  page.data.i18n = {
    localePath: page.pathLocale,
    untranslated:
      (page.frontmatter["untranslated"] as boolean | undefined) ?? false,
  };
  if (page.frontmatter["untranslated"])
    console.log("i18nData", page.path, page.data.i18n);
  delete page.frontmatter["untranslated"];

  if (page.pathLocale !== "/") {
    page.data.i18n.sourceLink = page.path.replace(page.pathLocale, "/");

    if (isGitRepo(cwd) && page.filePathRelative) {
      page.data.i18n.updatedTime =
        page.data["git"]?.["updatedTime"] ??
        (await getUpdatedTime([page.filePathRelative], cwd));
    }
  }
};

export { addPageData };
