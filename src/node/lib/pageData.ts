import { getUpdatedTime } from "@vuepress/plugin-git";
import type { I18nPluginTempFrontmatter, Page } from "../../shared/types";
import { isGitRepo } from "../utils";

const addPageData = async (page: Page, cwd: string) => {
  const i18nFrontmatter = page.frontmatter["_i18n"] as
    | I18nPluginTempFrontmatter
    | undefined;
  if (i18nFrontmatter?.filePathRelative)
    page.filePathRelative = i18nFrontmatter.filePathRelative;

  page.data.i18n = {
    localePath: i18nFrontmatter?.localePath ?? page.pathLocale,
    sourceLink: page.path.replace(page.pathLocale, "/"),
    untranslated: i18nFrontmatter?.untranslated ?? false,
  };

  delete page.frontmatter["_i18n"];

  if (isGitRepo(cwd) && page.filePathRelative) {
    page.data.i18n.updatedTime =
      page.data.git?.updatedTime ??
      (await getUpdatedTime([page.filePathRelative], cwd));
  }
};

export { addPageData };
