interface i18nPluginLocaleData {
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

export default i18nPluginLocaleData;
