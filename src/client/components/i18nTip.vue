<!-- eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain -->
<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import { usePageData } from "@vuepress/client";
import {
  containerClass,
  guideLink,
  linkRenderer,
  locales,
  titleClass,
} from "../define";
import type { PageData } from "../../shared/types";

const pageData = usePageData<PageData>();
const locale = locales[pageData.value.i18n?.localePath!] ?? locales["/"];
const showTips =
  pageData.value.i18n?.untranslated || pageData.value.i18n?.outdated;
const tipType = pageData.value.i18n?.untranslated ? "untranslated" : "outdated";
const containerType = tipType === "untranslated" ? "tip" : "warning";
const containerTitle = locale[tipType].title;
const containerContent =
  tipType === "untranslated"
    ? locale.untranslated.content(linkRenderer, guideLink)
    : locale.outdated.content(
        pageData.value.i18n?.updatedTime!,
        pageData.value.i18n?.sourceUpdatedTime!,
        pageData.value.i18n?.sourceLink!,
        linkRenderer
      );
</script>

<template>
  <div v-if="showTips" :class="[...containerClass, containerType]">
    <p :class="titleClass">
      {{ containerTitle }}
    </p>
    <!--eslint-disable-next-line vue/no-v-html -->
    <p v-html="containerContent"></p>
  </div>
</template>
