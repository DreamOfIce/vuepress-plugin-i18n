import type { Page as _Page, PageData as _PageData } from "@vuepress/core";
import type { GitData } from "@vuepress/plugin-git";

/**
 * Link rendering helper
 * @param text link text
 * @param href target URL
 * @returns html string
 */
type LinkRenderer = (text: string, href: string) => string;

interface I18nPluginLocaleData {
  /**
   * @description RFC5646 Language code
   * @example "en-US", "zh-CN"
   */
  lang: string;
  untranslated: {
    /**
     * @description Title of untranslated page tip
     */
    title: string;
    /**
     * Content of the container
     * @param linkRenderer link rendering helper
     * @param translationGuide links to translation guides (ignore the relevant section when empty)
     * @returns localized text
     */
    content: (linkRenderer: LinkRenderer, translationGuide?: string) => string;
  };
  outdated: {
    /**
     * @description Title of obsolete page tip
     */
    title: string;
    /**
     * Content of the container
     * @param linkRenderer link rendering helper
     * @param sourceUpdateTime unix timestamp for source page
     * @param translationUpdateTime unix timestamp for translation page
     * @param sourceLink url of the source page
     * @returns localized text
     */
    content: (
      linkRenderer: LinkRenderer,
      sourceUpdateTime: number,
      translationUpdateTime: number,
      sourceLink: string
    ) => string;
  };
}

interface I18nPluginFrontmatter {
  _i18n?: {
    filePathRelative?: string;
    pathLocale?: string;
    untranslated?: boolean;
  };
  gitInclude?: string[];
  tag?: string[];
}

interface I18nData {
  pathLocale?: string;
  outdated?: boolean;
  sourceLink?: string;
  sourceUpdatedTime?: number;
  untranslated?: boolean;
  updatedTime?: number | undefined;
}

interface I18nPluginPageData {
  i18n?: I18nData;
  /** maybe added by @vuepress/plugin-git */
  git?: GitData;
}

type Page = _Page<I18nPluginPageData, I18nPluginFrontmatter>;
type PageData = _PageData<I18nPluginPageData>;

export type {
  I18nPluginFrontmatter,
  I18nData,
  I18nPluginLocaleData,
  I18nPluginPageData,
  LinkRenderer,
  Page,
  PageData,
};
