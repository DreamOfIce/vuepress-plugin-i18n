import type { App, Page } from "@vuepress/core";
import type { I18nPluginLocaleData } from "../shared/types";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

interface I18nPluginTipOptions {
  /**
   * Enable tip containers
   * @default true
   */
  enable: boolean;
  /**
   * Classes of the container div (type of container will always be add)
   * @default ["custom-container", "hint-container"]
   */
  containerClass: string[];
  /**
   * Classes of the container title
   * @default ["custom-container-title", "hint-container-title"]
   */
  titleClass: string[];
}

interface I18nPluginInternalOptions {
  /**
   * Calculate updatedTime when not exist
   * @note may significantly slow down dev server startup
   * @default app.env.isBuild || app.env.isDebug
   */
  calcUpdatedTime: boolean;
  /**
   * Page filter
   * @param page Vuepress page object
   * @returns Whether the page should be included
   */
  filter: (page: Page) => boolean;
  /**
   * Link to translation guide(in default locale)
   */
  guideLink?: string;
  /**
   * Custom locales for i18n plugin
   */
  locales: Record<string, Partial<I18nPluginLocaleData>>;
  /**
   * Prefixes for source language
   * @default "/"
   */
  sourcePath: string;
  /**
   * Tip container options
   * @see I18nPluginTipOptions
   */
  tip: I18nPluginTipOptions;
  /**
   * Add tag `untranslated` or `outdated` to page
   * need to load before [vuepress-plugin-blog2]{@link https://www.npmjs.com/package/vuepress-plugin-blog2}
   * @default false
   */
  tag: boolean;
}

interface I18nPluginOptions
  extends Omit<DeepPartial<I18nPluginInternalOptions>, "tip"> {
  tip?: I18nPluginTipOptions | boolean;
}

const defaultOptions: I18nPluginInternalOptions = {
  filter: (page) => page.frontmatter["homepage"] !== true && !!page.filePath,
  locales: {},
  sourcePath: "/",
  tip: {
    enable: true,
    containerClass: ["custom-container", "hint-container"],
    titleClass: ["custom-container-title", "hint-container-title"],
  },
  tag: false,
  calcUpdatedTime: false,
};

const getOptions: (
  app: App,
  options: I18nPluginOptions
) => I18nPluginInternalOptions = (app, options) => ({
  ...defaultOptions,
  calcUpdatedTime: app.env.isBuild || app.env.isDebug,
  tip:
    typeof options.tip === "boolean"
      ? {
          ...defaultOptions.tip,
          enable: options.tip,
        }
      : options.tip ?? defaultOptions.tip,
  ...Object.fromEntries(
    Object.entries(options).filter(([key]) => key !== "tip")
  ),
});
export {
  defaultOptions,
  getOptions,
  type I18nPluginInternalOptions,
  type I18nPluginOptions,
};
