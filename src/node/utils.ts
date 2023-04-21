import {
  type App,
  type Page,
  type SiteData,
  preparePageComponent,
  renderPageContent,
} from "@vuepress/core";
import { Logger, deepAssign } from "vuepress-shared/node";
import pluginLocaleData from "./locales/index.js";
import type { I18nPluginInternalOptions } from "./options.js";

const PLUGIN_NAME = "vuepress-plugin-i18n";

const addComponent = async (app: App, page: Page, name: string) => {
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
      })
    );
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
      deepAssign(
        {},
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

const logger = new Logger(PLUGIN_NAME);

export {
  PLUGIN_NAME,
  addComponent,
  getLocales,
  insertAfterFrontmatter,
  logger,
};
