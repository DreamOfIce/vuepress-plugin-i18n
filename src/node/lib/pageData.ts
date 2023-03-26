import { getUpdatedTime } from "@vuepress/plugin-git";
import type { Page } from "../../shared/types";
import { isGitRepo } from "../utils";

const addPageData = async (page: Page, cwd: string) => {
  page.data.i18n = {
    localePath: page.pathLocale,
    untranslated:
      (page.frontmatter["untranslated"] as boolean | undefined) ?? false,
  };

  page.filePathRelative ??= page.frontmatter["filePathRelative"] as string;
  delete page.frontmatter["filePathRelative"];
  delete page.frontmatter["untranslated"];
  delete page.frontmatter["generatedByI18n"];

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
