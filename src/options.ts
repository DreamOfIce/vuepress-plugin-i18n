import type i18nPluginLocaleData from "./locales/types";
interface i18nPluginInternalOptions {
  addTips: boolean;
  addTag: boolean;
  locales: Record<string, i18nPluginLocaleData>;
  guideLink?: string;
}
type i18nPluginOptions = Partial<i18nPluginInternalOptions>;

const defaultOptions: i18nPluginInternalOptions = {
  addTips: true,
  addTag: false,
  locales: {},
};
export {
  defaultOptions,
  type i18nPluginInternalOptions,
  type i18nPluginOptions,
};
