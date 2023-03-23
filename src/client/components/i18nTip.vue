<script lang="ts">
import type { I18nPluginLocaleData } from "../../shared/types";

declare const I18N_PLUGIN_CONTAINER_CLASS: string[];
declare const I18N_PLUGIN_TITLE_CLASS: string[];
declare const I18N_PLUGIN_GUIDE_LINK: string | undefined;
declare const I18N_PLUGIN_LOCALES: I18nPluginLocaleData;

</script>

<script setup lang="ts">
import { usePageData } from "@vuepress/client";
import type { PageData } from "../../shared/types.js";
const containerClass = I18N_PLUGIN_CONTAINER_CLASS;
const titleClass = I18N_PLUGIN_TITLE_CLASS;
const locales = I18N_PLUGIN_LOCALES;
const guideLink = I18N_PLUGIN_GUIDE_LINK;

const pageData = usePageData<PageData>();
const showTips = pageData.value?.i18n?.untranslated || pageData.value?.i18n?.outdated;
const tipType = pageData.value?.i18n?.untranslated ? "untranslated" : "outdated";
const containerType = tipType === "untranslated" ? "tip" : "warning";
const containerTitle = locales[tipType].title;
const containerContent = tipType === "untranslated" ? locales.untranslated.content(guideLink) : locales.outdated.content(pageData.value.i18n!.updatedTime!, pageData.value.i18n!.sourceUpdatedTime!, pageData.value.i18n!.sourceLink!);

</script>

<template>
  <div :class="containerClass">
    <p v-if="showTips" :class="[...titleClass, containerType]">
      {{ containerTitle }}
    </p>
    <p>
      {{ containerContent }}
    </p>
  </div>
</template>

