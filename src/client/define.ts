import {
  linkRenderer as _linkRenderer,
  locales as _locales,
  //@ts-expect-error 2307
} from "@temp/i18n-locales";
import type { I18nPluginLocaleData, LinkRenderer } from "../shared/types";

// Vuepress defines
declare const I18N_PLUGIN_CONTAINER_CLASS: string[];
declare const I18N_PLUGIN_TITLE_CLASS: string[];
declare const I18N_PLUGIN_GUIDE_LINK: string | undefined;
const containerClass = I18N_PLUGIN_CONTAINER_CLASS;
const titleClass = I18N_PLUGIN_TITLE_CLASS;
const guideLink = I18N_PLUGIN_GUIDE_LINK;

// declare in temp files
interface Locales extends Record<string, I18nPluginLocaleData> {
  "/": I18nPluginLocaleData;
}
const locales = _locales as Locales;
const linkRenderer = _linkRenderer as LinkRenderer;

export { containerClass, guideLink, linkRenderer, locales, titleClass };
