import type { App, Page } from "@vuepress/core";
import type { I18nPluginLocaleData } from "../shared/types.js";

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
   * Prefixes for source language
   * @default "/"
   */
  baseLocalePath: string;
  /**
   * Page filter
   * @param page VuePress page object
   * @returns Whether the page should be included
   */
  filter: (page: Page) => boolean;
  /**
   * Link to translation guide(in default locale)
   */
  translationGuide?: string;
  /**
   * Custom locales for i18n plugin
   */
  locales: Record<string, Partial<I18nPluginLocaleData>>;
  /**
   * Add tag `untranslated` or `outdated` to page
   * need to load before [vuepress-plugin-blog2]{@link https://www.npmjs.com/package/vuepress-plugin-blog2}
   * @default false
   */
  tag: boolean;
  /**
   * Tip container options
   * @see I18nPluginTipOptions
   */
  tip: I18nPluginTipOptions;
  /**
   * Calculate updatedTime when not exist
   * - `git`: read updated time from git
   * - `file`: read updated time from file info
   * - a function:
   *   @param page VuePress page object
   *   @param app VuePress app
   *   @returns a mode name or a timestamp
   * @note git mode may significantly slow down dev server startup
   * @default (_page, app) => app.env.isBuild || app.env.isDebug ? "git" : undefined
   */
  updatedTime:
    | "git"
    | "file"
    | ((page: Page, app: App) => number | undefined | "git" | "file");
}

interface I18nPluginOptions
  extends Omit<DeepPartial<I18nPluginInternalOptions>, "tip"> {
  tip?: I18nPluginTipOptions | boolean;
}

const defaultOptions: I18nPluginInternalOptions = {
  filter: (page) => page.frontmatter["homepage"] !== true && !!page.filePath,
  locales: {},
  baseLocalePath: "/",
  tip: {
    enable: true,
    containerClass: ["custom-container", "hint-container"],
    titleClass: ["custom-container-title", "hint-container-title"],
  },
  tag: false,
  updatedTime: (_page, app) =>
    app.env.isBuild || app.env.isDebug ? "git" : undefined,
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
