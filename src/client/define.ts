import {
  guideLinks as _guideLinks,
  linkRenderer as _linkRenderer,
  locales as _locales,
  //@ts-expect-error 2307
} from "@temp/i18n-locales";
import type { I18nPluginLocaleData, LinkRenderer } from "../shared/types.js";

// VuePress defines
declare const I18N_PLUGIN_CONTAINER_CLASS: string[];
declare const I18N_PLUGIN_SOURCE_PREFIX: string;
declare const I18N_PLUGIN_TITLE_CLASS: string[];
const containerClass = I18N_PLUGIN_CONTAINER_CLASS;
const sourcePath = I18N_PLUGIN_SOURCE_PREFIX;
const titleClass = I18N_PLUGIN_TITLE_CLASS;

// declare in file ${temp}/i18n-locales.ts
type Locales = Record<string, I18nPluginLocaleData>;

const guideLinks = _guideLinks as Record<string, string | undefined>;
const linkRenderer = _linkRenderer as LinkRenderer;
const locales = _locales as Locales;

export {
  containerClass,
  guideLinks,
  linkRenderer,
  locales,
  sourcePath,
  titleClass,
};
