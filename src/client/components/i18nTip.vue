<script lang="ts">
declare const I18N_PLUGIN_CONTAINER_CLASS: string[];
declare const I18N_PLUGIN_TITLE_CLASS: string[];
declare const I18N_PLUGIN_GUIDE_LINK: string | undefined;
</script>

<script setup lang="ts">
import { usePageData } from "@vuepress/client";
import { computed } from "vue";
//@ts-expect-error 2307
import { locales } from "@temp/i18n-locales";
import type { PageData } from "../../shared/types";

const containerClass = I18N_PLUGIN_CONTAINER_CLASS;
const titleClass = I18N_PLUGIN_TITLE_CLASS;
const guideLink = I18N_PLUGIN_GUIDE_LINK;

const pageData = usePageData<PageData>();
console.log(pageData.value);
const locale = locales[pageData.value.i18n?.localePath!] ?? locales["/"]!;
const showTips = computed(
  () => pageData.value.i18n?.untranslated || pageData.value.i18n?.outdated
);
const tipType = computed(() =>
  pageData.value.i18n?.untranslated ? "untranslated" : "outdated"
);
const containerType = computed(() =>
  tipType.value === "untranslated" ? "tip" : "warning"
);
const containerTitle = computed(() => locale[tipType.value].title);
const containerContent = computed(() =>
  tipType.value === "untranslated"
    ? locale.untranslated.content(guideLink)
    : locale.outdated.content(
        pageData.value.i18n?.updatedTime!,
        pageData.value.i18n?.sourceUpdatedTime!,
        pageData.value.i18n?.sourceLink!
      )
);
</script>

<template>
  <div v-if="showTips" :class="containerClass">
    <p :class="[...titleClass, containerType]">
      {{ containerTitle }}
    </p>
    <p>
      {{ containerContent }}
    </p>
  </div>
</template>
