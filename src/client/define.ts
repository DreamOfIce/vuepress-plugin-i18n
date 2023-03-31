import {
  guideLinks as _guideLinks,
  linkRenderer as _linkRenderer,
  locales as _locales,
  //@ts-expect-error 2307
} from "@temp/i18n-locales";
import type { I18nPluginLocaleData, LinkRenderer } from "../shared/types";

// Vuepress defines
declare const I18N_PLUGIN_CONTAINER_CLASS: string[];
declare const I18N_PLUGIN_TITLE_CLASS: string[];
const containerClass = I18N_PLUGIN_CONTAINER_CLASS;
const titleClass = I18N_PLUGIN_TITLE_CLASS;

// declare in file ${temp}/i18n-locales.ts
interface Locales extends Record<string, I18nPluginLocaleData> {
  "/": I18nPluginLocaleData;
}

const guideLinks = _guideLinks as Record<string, string | undefined>;
const linkRenderer = _linkRenderer as LinkRenderer;
const locales = _locales as Locales;

export { containerClass, guideLinks, linkRenderer, locales, titleClass };
