import {
  type App,
  type Page,
  type SiteData,
  renderPageContent,
} from "@vuepress/core";
import { Logger, deepAssign } from "vuepress-shared/node";
import pluginLocaleData from "./locales/index.js";
import type { I18nPluginLocaleData } from "../shared/types.js";

const PLUGIN_NAME = "vuepress-plugin-i18n";

const addComponent = (app: App, page: Page, name: string) => {
  const { content, filePath, filePathRelative, frontmatter, path } = page;
  const fmRegExp = /^---$/gm;
  const headRegExp = /^[\r\n]+#\s.+?[\r\n]+/g;
  fmRegExp.exec(content);
  fmRegExp.exec(content);
  let index = fmRegExp.lastIndex ?? 0;
  headRegExp.exec(content.slice(index));
  index += headRegExp.lastIndex;

  if (!content.slice(index).startsWith(`<${name} />\n`)) {
    page.content =
      content.slice(0, index) + `<${name} />\n` + content.slice(index);
    Object.assign(
      page,
      renderPageContent({
        app,
        content: page.content,
        filePath,
        filePathRelative,
        options: {
          path,
          frontmatter,
          content,
          ...(filePath
            ? {
                filePath,
              }
            : {}),
        },
      }),
    );
  }
};

const getLocales = (
  siteData: SiteData,
  customLocales: Record<string, Partial<I18nPluginLocaleData>>,
) =>
  Object.fromEntries(
    Object.entries(siteData.locales).map(([path, { lang = siteData.lang }]) => [
      path,
      deepAssign(
        {},
        pluginLocaleData[lang] ??
          pluginLocaleData[siteData.lang] ??
          pluginLocaleData["en-US"]!,
        customLocales[lang],
      ),
    ]),
  ) as Record<string, I18nPluginLocaleData>;

const getPageFromDataFilePath = (app: App, path: string) =>
  app.pages.find((page) => page.dataFilePath === path);

const insertAfterFrontmatter = (content: string, data: string) => {
  const regexp = /^---$/gm;
  regexp.exec(content);
  regexp.exec(content);
  let index = regexp.lastIndex ?? 0;
  if (content.at(index) === "\r") index++;
  if (content.at(index) === "\n") index++;
  return content.slice(0, index) + data + content.slice(index);
};

const logger = new Logger(PLUGIN_NAME);

export {
  PLUGIN_NAME,
  addComponent,
  getLocales,
  getPageFromDataFilePath,
  insertAfterFrontmatter,
  logger,
};
