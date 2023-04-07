import type { Page, SiteData } from "@vuepress/core";
import { colors } from "@vuepress/utils";
import { deepmerge } from "deepmerge-ts";
import type { Formatter } from "picocolors/types";
import pluginLocaleData from "./locales";
import type { I18nPluginInternalOptions } from "./options";

const PLUGIN_NAME = "vuepress-plugin-i18n";

const addTipComponent = (page: Page) =>
  (page.content = insertAfterFrontmatter(page.content, "<I18nTip />\n"));

const getLocales = (
  siteData: SiteData,
  customLocales: I18nPluginInternalOptions["locales"]
) =>
  Object.fromEntries(
    Object.entries(siteData.locales).map(([path, { lang = siteData.lang }]) => [
      path,
      deepmerge(
        customLocales[lang],
        pluginLocaleData[lang] ??
          pluginLocaleData[siteData.lang] ??
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pluginLocaleData["en-US"]!
      ),
    ])
  );

const insertAfterFrontmatter = (content: string, data: string) => {
  const regexp = /^---$/gm;
  regexp.exec(content);
  regexp.exec(content);
  const index = regexp.lastIndex + 1 ?? 0;
  return content.slice(0, index) + data + content.slice(index);
};

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logger = (level: keyof typeof logColor, ...message: any[]) => {
  console[level](
    `${logColor[level](level)} ${colors.blue(PLUGIN_NAME)} `,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ...message
  );
};

export {
  PLUGIN_NAME,
  addTipComponent,
  getLocales,
  insertAfterFrontmatter,
  logger,
};
