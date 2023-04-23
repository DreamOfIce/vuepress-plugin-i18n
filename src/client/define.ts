import {
  translationGuides as _translationGuides,
  locales as _locales,
  //@ts-expect-error 2307
} from "@temp/i18n-locales";
import type { I18nPluginLocaleData } from "../shared/types.js";

// VuePress defines
declare const I18N_PLUGIN_CONTAINER_CLASS: string[];
declare const I18N_PLUGIN_BASE_LOCALE_PATH: string;
declare const I18N_PLUGIN_TITLE_CLASS: string[];
const containerClass = I18N_PLUGIN_CONTAINER_CLASS;
const baseLocalePath = I18N_PLUGIN_BASE_LOCALE_PATH;
const titleClass = I18N_PLUGIN_TITLE_CLASS;

// declare in file ${temp}/i18n-locales.js
type Locales = Record<string, I18nPluginLocaleData>;

const translationGuides = _translationGuides as Record<
  string,
  string | undefined
>;
const locales = _locales as Locales;

export {
  containerClass,
  translationGuides,
  locales,
  baseLocalePath,
  titleClass,
};
