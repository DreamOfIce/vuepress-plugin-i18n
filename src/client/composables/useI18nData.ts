import { usePageData } from "@vuepress/client";
import { computed, type ComputedRef } from "vue";
import type { I18nData, I18nPluginPageData } from "../../shared/types.js";
import {
  baseLocalePath,
  containerClass,
  locales,
  titleClass,
  translationGuides,
} from "../define.js";

/**
 * Get the i18n metadata of current page
 */
export const useI18nData = (): ComputedRef<I18nData> =>
  computed(() => {
    const {
      outdated: isOutdated = false,
      pathLocale = baseLocalePath,
      sourceLink,
      sourceUpdatedTime,
      untranslated: isUntranslated = false,
      updatedTime,
    } = usePageData<I18nPluginPageData>().value.i18n ?? {};

    const locale =
      locales[pathLocale ?? baseLocalePath] ?? locales[baseLocalePath]!;
    const translationGuide =
      translationGuides[pathLocale] ?? translationGuides[baseLocalePath];
    return {
      isOutdated,
      isUntranslated,
      locale,
      options: {
        baseLocalePath,
        containerClass,
        titleClass,
      },
      pathLocale,
      sourceLink,
      sourceUpdatedTime,
      translationGuide,
      updatedTime,
    };
  });
