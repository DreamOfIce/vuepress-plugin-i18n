import type { Page } from "@vuepress/core";
import { checkGitRepo } from "@vuepress/plugin-git";
import { colors } from "@vuepress/utils";
import type { Formatter } from "picocolors/types";

const PLUGIN_NAME = "vuepress-plugin-i18n";

const insertAfterFrontmatter = (content: string, data: string) => {
  const regexp = /^---$/gm;
  regexp.exec(content);
  regexp.exec(content);
  const index = regexp.lastIndex;
  return content.slice(0, index) + data + content.slice(index);
};

let gitStatus: boolean;
/**
 * Return true if `cwd` is a Git repo. Note that it will cache the first result and ignore subsequent cwd's
 * @param cwd dir to test
 */
const isGitRepo = (cwd: string) => gitStatus ?? !checkGitRepo(cwd);

const isSourcePage = (page: Page) => page.pathLocale === "/";

// To solve https://github.com/microsoft/TypeScript/issues/42873
const logColor = {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  debug: colors.cyan as Formatter,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  info: colors.green as Formatter,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  warn: colors.yellow as Formatter,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  error: colors.red as Formatter,
};

const logger = (level: keyof typeof logColor, ...message: string[]) => {
  console[level](
    `${logColor[level](level)} ${colors.blue(PLUGIN_NAME)} `,
    ...message
  );
};

export { PLUGIN_NAME, logger, insertAfterFrontmatter, isGitRepo, isSourcePage };
