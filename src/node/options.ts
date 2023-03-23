import type { Page } from "@vuepress/core";
import type { I18nPluginLocaleData } from "../shared/types";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

interface I18nPluginTipOptions {
  enable: boolean;
  containerClass: string[];
  titleClass: string[];
}
interface I18nPluginInternalOptions {
  tip: I18nPluginTipOptions;
  filter: (page: Page) => boolean;
  locales: Record<string, Omit<I18nPluginLocaleData, "lang">>;
  guideLink?: string;
}

interface I18nPluginOptions
  extends Omit<DeepPartial<I18nPluginInternalOptions>, "tip"> {
  tip?: I18nPluginTipOptions | boolean;
}

const defaultOptions: I18nPluginInternalOptions = {
  tip: {
    enable: true,
    containerClass: ["custom-container", "hint-container"],
    titleClass: ["custom-container-title", "hint-container-title"],
  },
  filter: (page) => page.frontmatter["homepage"] !== true && !!page.filePath,
  locales: {},
};

const getOptions: (options: I18nPluginOptions) => I18nPluginInternalOptions = (
  options
) => ({
  ...defaultOptions,
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
