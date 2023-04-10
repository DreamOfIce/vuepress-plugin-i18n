import {
  type App,
  type Page,
  type SiteData,
  preparePageComponent,
} from "@vuepress/core";
import type { MarkdownEnv } from "@vuepress/markdown";
import { colors } from "@vuepress/utils";
import { deepmerge } from "deepmerge-ts";
import type { Formatter } from "picocolors/types";
import pluginLocaleData from "./locales";
import type { I18nPluginInternalOptions } from "./options";

const PLUGIN_NAME = "vuepress-plugin-i18n";

const addComponent = async (app: App, page: Page, name: string) => {
  const content = page.content;
  const fmRegExp = /^---$/gm;
  const headRegExp = /^[\r\n]+#\s[^\r\n]+/;
  fmRegExp.exec(content);
  fmRegExp.exec(content);
  let index = fmRegExp.lastIndex ?? 0;
  headRegExp.exec(content.slice(index));
  index += headRegExp.lastIndex;

  if (!content.slice(index).startsWith(`<${name} />\n`)) {
    const markdownEnv: MarkdownEnv = page.markdownEnv;
    page.content =
      content.slice(0, index) + `<${name} />\n` + content.slice(index);
    page.contentRendered = app.markdown.render(page.content, markdownEnv);
    page.sfcBlocks = { ...page.sfcBlocks, ...markdownEnv.sfcBlocks };
    await preparePageComponent(app, page);
  }
};

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
  let index = regexp.lastIndex ?? 0;
  if (content.at(index) === "\r") index++;
  if (content.at(index) === "\n") index++;
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
const logger = (level: keyof typeof logColor, ...message: any[]) =>
  console[level](
    `${logColor[level](level)} ${colors.blue(PLUGIN_NAME)} `,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ...message
  );

export {
  PLUGIN_NAME,
  addComponent,
  getLocales,
  insertAfterFrontmatter,
  logger,
};
