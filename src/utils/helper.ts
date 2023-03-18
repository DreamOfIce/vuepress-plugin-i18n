import type { App, Page } from "@vuepress/core";
import * as localeData from "../locales/index.js";
import type i18nPluginLocaleData from "../locales/types.js";

const chooseLocaleData = (
  siteData: App["siteData"],
  customLocales: Record<string, i18nPluginLocaleData>,
  path: string,
  langPrefix: string
): i18nPluginLocaleData =>
  customLocales[langPrefix] ??
  (Object.values(localeData).find(
    ({ lang }) => lang === (siteData.locales[path]?.lang ?? siteData.lang)
  ) as i18nPluginLocaleData);

const createContainer = (type: string, title: string, content: string) =>
  `::: ${type} ${title}\n${content}\n:::\n`;

const getLanguage = (path: string, translationPrefixs: string[]) =>
  translationPrefixs
    .sort((path1, path2) => path2.split("/").length - path1.split("/").length) // Sort by path level
    .find((prefix) => path.startsWith(prefix)) ?? "/";

const insertAfterFrontmatter = (content: string, data: string) => {
  const regexp = /^---$/gm;
  regexp.exec(content);
  regexp.exec(content);
  const index = regexp.lastIndex;
  return content.slice(0, index) + data + content.slice(index);
};

const isSourcePage = (page: Page, translationPrefixs: string[]) =>
  translationPrefixs.reduce(
    (acc, prefix) => acc && !page.path.startsWith(prefix),
    true
  );

export {
  chooseLocaleData,
  createContainer,
  getLanguage,
  insertAfterFrontmatter,
  isSourcePage,
};
