import type { Page as _Page, PageData as _PageData } from "@vuepress/core";
import type { GitData } from "@vuepress/plugin-git";

interface I18nPluginLocaleData {
  /**
   * @description RFC5646 Language code
   */
  lang: string;
  untranslated: {
    /**
     * @description Title of tips container
     */
    title: string;
    /**
     * Content of the container
     * @param guideLink Links to translation guides (ignore the relevant section when empty)
     * @returns Localised text (support Markdown syntax)
     */
    content: (guideLink?: string) => string;
  };
  outdated: {
    /**
     * @description Title of warning container
     */
    title: string;
    /**
     * Content of the container
     * @param sourceUpdateTime Unix timestamp for source page
     * @param translationUpdateTime Unix timestamp for translation page
     * @param sourceLink
     * @returns Localised text (support Markdown syntax)
     */
    content: (
      sourceUpdateTime: number,
      translationUpdateTime: number,
      sourceLink: string
    ) => string;
  };
}
interface I18nData {
  localePath?: string;
  outdated?: boolean;
  sourceLink?: string;
  sourceUpdatedTime?: number;
  untranslated?: boolean;
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
  I18nData,
  I18nPluginLocaleData,
  I18nPluginPageData,
  Page,
  PageData,
};
