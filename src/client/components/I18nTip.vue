<script setup lang="ts">
import { usePageData } from "@vuepress/client";
import {
  containerClass,
  guideLinks,
  linkRenderer,
  locales,
  baseLocalePath,
  titleClass,
} from "../define";
import type {
  I18nData,
  I18nPluginLocaleData,
  PageData,
} from "../../shared/types";
import { computed } from "vue";

type I18nPluginTipType = "untranslated" | "outdated";

const getContent = (
  type: I18nPluginTipType,
  locale: I18nPluginLocaleData,
  i18nData?: I18nData
) => {
  switch (type) {
    case "untranslated":
      return locale.untranslated.content(
        linkRenderer,
        guideLinks[i18nData?.pathLocale ?? baseLocalePath] ??
          guideLinks[baseLocalePath]
      );
    case "outdated":
      if (
        !i18nData?.updatedTime ||
        !i18nData?.sourceUpdatedTime ||
        !i18nData?.sourceLink
      ) {
        return null;
      } else {
        return locale.outdated.content(
          linkRenderer,
          i18nData?.sourceUpdatedTime,
          i18nData?.updatedTime,
          i18nData?.sourceLink
        );
      }
    default:
      return null;
  }
};

const pageData = usePageData<PageData>();
const locale = computed(
  () =>
    locales[pageData.value.i18n?.pathLocale ?? baseLocalePath] ??
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    locales[baseLocalePath]!
);
const showTips = computed(
  () => pageData.value.i18n?.untranslated || pageData.value.i18n?.outdated
);
const tipType = computed(() =>
  pageData.value.i18n?.untranslated ? "untranslated" : "outdated"
);
const containerType = computed(() =>
  tipType.value === "untranslated" ? "tip" : "warning"
);
const containerTitle = computed(() => locale.value[tipType.value].title);
const containerContent = computed(() =>
  showTips.value
    ? getContent(tipType.value, locale.value, pageData.value.i18n)
    : null
);
</script>

<template>
  <div
    v-if="showTips && containerContent"
    :class="[...containerClass, containerType]"
  >
    <p :class="titleClass">
      {{ containerTitle }}
    </p>
    <!--eslint-disable-next-line vue/no-v-html -->
    <p v-html="containerContent"></p>
  </div>
</template>
