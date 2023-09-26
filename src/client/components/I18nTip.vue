<script setup lang="ts">
import type {
  I18nData,
  I18nPluginLocaleData,
  LinkRenderer,
} from "../../shared/types";
import { computed } from "vue";
import { isAbsoluteUrl } from "vuepress-shared/client";
import { useI18nData } from "../composables";

type I18nPluginTipType = "untranslated" | "outdated";

const linkRenderer: LinkRenderer = (text, url) =>
  `<a href="${url}"${isAbsoluteUrl(url) ? ` target="_blank"` : ""}>${text}</a>`;

const getContent = (
  type: I18nPluginTipType,
  locale: I18nPluginLocaleData,
  i18nData: I18nData,
) => {
  switch (type) {
    case "untranslated":
      return locale.untranslated.content(
        linkRenderer,
        i18nData.translationGuide,
      );
    case "outdated":
      if (
        !i18nData.updatedTime ||
        !i18nData.sourceUpdatedTime ||
        !i18nData.sourceLink
      ) {
        return null;
      } else {
        return locale.outdated.content(
          linkRenderer,
          i18nData.sourceUpdatedTime,
          i18nData.updatedTime,
          i18nData.sourceLink,
        );
      }
    default:
      return null;
  }
};

const i18nData = useI18nData();
const { containerClass, titleClass } = i18nData.value.options;
const locale = computed(() => i18nData.value.locale);
const showTips = computed(
  () => i18nData.value.isUntranslated || i18nData.value.isOutdated,
);
const tipType = computed(() =>
  i18nData.value.isUntranslated ? "untranslated" : "outdated",
);
const containerType = computed(() =>
  tipType.value === "untranslated" ? "tip" : "warning",
);
const containerTitle = computed(() => locale.value[tipType.value].title);
const containerContent = computed(() =>
  showTips.value
    ? getContent(tipType.value, locale.value, i18nData.value)
    : null,
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
