import { getUpdatedTime } from "@vuepress/plugin-git";
import type { I18nPluginFrontmatter, Page } from "../../shared/types";
import type { I18nPluginInternalOptions } from "../options";
import { isGitRepo } from "../utils";

const addPageData = async (
  page: Page,
  cwd: string,
  options: I18nPluginInternalOptions
) => {
  const i18nFrontmatter = (page.frontmatter as I18nPluginFrontmatter)["_i18n"];
  if (i18nFrontmatter?.filePathRelative)
    page.filePathRelative = i18nFrontmatter.filePathRelative;

  page.data.i18n ||= {
    localePath: i18nFrontmatter?.localePath ?? page.pathLocale,
    sourceLink: page.path.replace(page.pathLocale, options.sourcePath),
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
