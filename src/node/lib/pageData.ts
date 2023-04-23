import { checkGitRepo, getUpdatedTime } from "@vuepress/plugin-git";
import { path } from "@vuepress/utils";
import type { I18nPluginFrontmatter, Page } from "../../shared/types.js";
import type { I18nPluginInternalOptions } from "../options.js";

let inGitRepo: boolean;

const isGitRepo = (cwd: string) => (inGitRepo ??= checkGitRepo(cwd));

export const addPageData = async (
  page: Page,
  cwd: string,
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

  if (page.data.git?.updatedTime) {
    page.data.i18n.updatedTime = page.data.git.updatedTime;
  } else if (
    options.calcUpdatedTime &&
    isGitRepo(cwd) &&
    page.filePathRelative
  ) {
    page.data.git ||= {};
    page.data.i18n.updatedTime = page.data.git.updatedTime =
      await getUpdatedTime(
        [
          page.filePathRelative,
          ...(page.frontmatter.gitInclude ?? []).map((item) =>
            path.join(page.filePathRelative, "..", item)
          ),
        ],
        cwd
      );
  }

  if (i18nFrontmatter?.filePathRelative)
    page.filePathRelative = i18nFrontmatter.filePathRelative;
};
