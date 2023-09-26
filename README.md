# vuepress-plugin-i18n

I18n plugin for [VuePress v2](https://github.com/vuepress/vuepress-next)

[中文版本](./README_zh-CN.md)

## Features

- [x] Fill non-existent pages in translation directories
- [x] Translation outdated alert (based on git or file info)
- [x] HMR support
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
   * Path prefix for source language version
   * @default "/"
   */
  baseLocalePath?: string;
  /**
   * Page filter
   * @param page VuePress page object
   * @returns Whether the page should be included
   */
  filter?: (page: Page) => boolean;
  /**
   * Custom locales for i18n plugin
   */
  locales?: Record<string, Partial<I18nPluginLocaleData>>;
  /**
   * Add tag `untranslated` or `outdated` to page
   * need to load before [vuepress-plugin-blog2]{@link https://www.npmjs.com/package/vuepress-plugin-blog2}
   * @default false
   */
  tag?: boolean;
  /**
   * Tip container options
   * @see I18nPluginTipOptions
   * @default true
   */
  tip?: I18nPluginTipOptions | boolean;
  /**
   * Link to translation guide(in default locale)
   */
  translationGuide?: string;
  /**
   * Calculate updatedTime when not exist
   * - `git`: read updated time from git
   * - `file`: read updated time from file info
   * - a function:
   *   @param page VuePress page object
   *   @param app VuePress app
   *   @returns a mode name or a timestamp
   * @note git mode may significantly slow down dev server startup
   * @default (_page, app) => app.env.isBuild || app.env.isDebug ? "git" : undefined
   */
  updatedTime?:
    | "git"
    | "file"
    | ((page: Page, app: App) => number | undefined | "git" | "file");
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
  /**
   * Name for tip component, which will be inserted at the top of the page
   * NOTE: You need to import your custom component globally by yourself
   * @default "I18nTip"
   */
  tipComponent: string;
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
      sourceLink: string,
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

## Advanced

### Client helper

You can use the `useI18nData` function to import the i18n information for the current page:

```ts
import { useI18nData } from "vuepress-plugin-i18n";

const i18nData = useI18nData(); // will return a computed ref of I18nData
console.log(i18nData.value);
```

Type definition of computed property returned:

```ts
interface I18nData {
  isOutdated: boolean;
  isUntranslated: boolean;
  locale: I18nPluginLocaleData;
  options: {
    baseLocalePath: string;
    containerClass: string[];
    titleClass: string[];
  };
  pathLocale: string;
  sourceLink: string | undefined;
  sourceUpdatedTime: number | undefined;
  translationGuide: string | undefined;
  updatedTime: number | undefined;
}
```

A common use of this function is to write custom tip component, For an example, please refer to the source code of [default component](./src/client/components/I18nTip.vue)

## License

MIT
