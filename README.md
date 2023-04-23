# vuepress-plugin-i18n

I18n plugin for [VuePress v2](https://github.com/vuepress/vuepress-next)

[中文版本](./README_zh-CN.md)

## Features

- [x] Fill non-existent pages in translation directories
- [x] Translation obsolescence alert (based on git data)
- [ ] HMR support
- [ ] Development guide

## Usage

### Install

```shell
npm install -D vuepress-plugin-i18n
```

Or using `pnpm`:

```shell
pnpm add -D vuepress-plugin-i18n
```

### Enable plugin

```ts
import { defineUserConfig } from "vuepress";
import i18nPlugin from "vuepress-plugin-i18n";

export default defineUserConfig({
  // ...
  plugins: [
    i18nPlugin({
      // plugin options
    }),
  ],
});
```

## Options

### Plugin options

```ts
interface I18nPluginOptions {
  /**
   * Calculate updatedTime when not exist
   * @note may significantly slow down dev server startup
   * @default app.env.isBuild || app.env.isDebug
   */
  calcUpdatedTime: boolean;
  /**
   * Page filter
   * @param page VuePress page object
   * @returns Whether the page should be included
   */
  filter?: (page: Page) => boolean;
  /**
   * Link to translation guide(in default locale)
   */
  translationGuide?: string;
  /**
   * Custom locales for i18n plugin
   */
  locales?: Record<string, Partial<I18nPluginLocaleData>>;
  /**
   * Path prefix for source language version
   * @default "/"
   */
  baseLocalePath?: string;
  /**
   * Tip container options
   * @see I18nPluginTipOptions
   * @default true
   */
  tip?: I18nPluginTipOptions | boolean;
  /**
   * Add tag `untranslated` or `outdated` to page
   * need to load before [vuepress-plugin-blog2]{@link https://www.npmjs.com/package/vuepress-plugin-blog2}
   * @default false
   */
  tag?: boolean;
}

interface I18nPluginTipOptions {
  /**
   * Enable tip containers
   * @default true
   */
  enable?: boolean;
  /**
   * Classes of the container div (type of container will always be add)
   * @default ["custom-container", "hint-container"]
   */
  containerClass?: string[];
  /**
   * Classes of the container title
   * @default ["custom-container-title", "hint-container-title"]
   */
  titleClass?: string[];
}
```

### Localization options

```ts
interface I18nPluginLocaleData {
  /**
   * @description RFC5646 Language code
   * @example "en-US", "zh-CN"
   */
  lang: string;
  untranslated: {
    /**
     * @description Title of untranslated page tip
     */
    title: string;
    /**
     * Content of the container
     * @param linkRenderer link rendering helper
     * @param translationGuide links to translation guides (ignore the relevant section when empty)
     * @returns localised text
     */
    content: (linkRenderer: LinkRenderer, translationGuide?: string) => string;
  };
  outdated: {
    /**
     * @description Title of obsolete page tip
     */
    title: string;
    /**
     * Content of the container
     * @param linkRenderer link rendering helper
     * @param sourceUpdateTime unix timestamp for source page
     * @param translationUpdateTime unix timestamp for translation page
     * @param sourceLink url of the source page
     * @returns localised text
     */
    content: (
      linkRenderer: LinkRenderer,
      sourceUpdateTime: number,
      translationUpdateTime: number,
      sourceLink: string
    ) => string;
  };
}

/**
 * Link rendering helper
 * @param text link text
 * @param href target URL
 * @returns html string
 */
type LinkRenderer = (text: string, href: string) => string;
```
