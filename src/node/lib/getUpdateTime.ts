import { fs } from "@vuepress/utils";
import { checkGitRepo, getUpdatedTime } from "@vuepress/plugin-git";
import { path } from "@vuepress/utils";
import type { App } from "vuepress";
import type { I18nPluginInternalOptions } from "../options.js";
import { logger } from "../utils.js";
import type { Page } from "../../shared/types.js";

const inGitRepo: Record<string, boolean> = {};
const isGitRepo = (cwd: string) => (inGitRepo[cwd] ??= checkGitRepo(cwd));

export const getUpdateTime = async (
  page: Page,
  app: App,
  options: I18nPluginInternalOptions
): Promise<number | undefined> => {
  let updatedTimeType = options.updatedTime;
  if (typeof updatedTimeType === "function") {
    const result = updatedTimeType(page, app);
    if (result === "git" || result === "file") updatedTimeType = result;
    else return result;
  }
  switch (updatedTimeType) {
    case "git": {
      const cwd = app.dir.source();
      if (page.data.git?.updatedTime) {
        return page.data.git.updatedTime;
      } else if (isGitRepo(cwd) && page.filePathRelative) {
        return await getUpdatedTime(
          [
            page.filePathRelative,
            ...(page.frontmatter.gitInclude ?? []).map((item) =>
              path.join(page.filePathRelative, "..", item)
            ),
          ],
          cwd
        );
      }
      break;
    }
    case "file": {
      if (page.filePath) {
        return (await fs.stat(page.filePath)).mtimeMs;
      }
      break;
    }
    default: {
      logger.warn(
        `Invalid updatedTime type: ${updatedTimeType as string}, ignored.`
      );
      break;
    }
  }
  return undefined;
};
