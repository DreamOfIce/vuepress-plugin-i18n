import type { Page as _Page, PageData as _PageData } from "@vuepress/core";
import type { GitData } from "@vuepress/plugin-git";

/**
 * Link rendering helper
 * @param text link text
 * @param href target URL
 * @returns html string
 */
declare function RenderLink(text: string, href: string): string;

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
     * @param guideLink links to translation guides (ignore the relevant section when empty)
     * @returns localised text
     */
    content: (linkRenderer: typeof RenderLink, guideLink?: string) => string;
  };
  outdated: {
    /**
     * @description Title of obsolete page tip
     */
    title: string;
    /**
     * Content of the container
     * @param sourceUpdateTime unix timestamp for source page
     * @param translationUpdateTime unix timestamp for translation page
     * @param sourceLink url of the source page
     * @param linkRenderer link rendering helper
     * @returns localised text
     */
    content: (
      sourceUpdateTime: number,
      translationUpdateTime: number,
      sourceLink: string,
      linkRenderer: typeof RenderLink
    ) => string;
  };
}

interface I18nPluginTempFrontmatter {
  filePathRelative?: string;
  localePath?: string;
  untranslated?: boolean;
}

interface I18nData {
  localePath: string;
  outdated?: boolean;
  sourceLink?: string;
  sourceUpdatedTime?: number;
  untranslated: boolean;
  updatedTime?: number;
}

interface I18nPluginPageData {
  i18n?: I18nData;
  /** mayby added by @vuepress/plugin-git */
  git?: GitData;
}

type Page = _Page<I18nPluginPageData>;
type PageData = _PageData<I18nPluginPageData>;

export type {
  I18nPluginTempFrontmatter,
  I18nData,
  I18nPluginLocaleData,
  I18nPluginPageData,
  Page,
  PageData,
};
