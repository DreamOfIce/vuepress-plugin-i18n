# vuepress-plugin-i18n

适用于 [Vuepress v2](https://github.com/vuepress/vuepress-next) 的 i18n 插件

[English version](./README.md)

## 功能

- [x] 填充翻译目录下不存在的页面
- [x] 翻译过时提示(基于 git 数据)
- [ ] HMR 支持

## 食用方法

### 安装插件

> 在大多数场景中(特别是 monorepo), 建议将本插件以及 vuepress 作为开发依赖安装:

```shell
npm install -D vuepress-plugin-i18n
```

或者使用`pnpm`:

```shell
pnpm add -D vuepress-plugin-i18n
```

### 添加插件

```ts
import { defineUserConfig } from "vuepress";
import i18nPlugin from "vuepress-plugin-i18n";

export default defineUserConfig({
  // ...
  plugins: [
    i18nPlugin({
      // 插件配置
    }),
  ],
});
```

### 配置

```ts
interface I18nPluginOptions {
  /**
   * 提示功能配置, false 表示禁用
   * @see I18nPluginTipOptions
   * @default true
   */
  tip?: I18nPluginTipOptions | boolean;
  /**
   * 页面过滤器, 默认包含主页外所有由 markdown 文件生成的页面
   * @param page Vuepress的 page 对象
   * @returns 插件是否应该包含此页面
   */
  filter?: (page: Page) => boolean;
  /**
   * 自定义本地化配置, 应为一个以路径前缀为键，本地化数据为值的对象
   */
  locales?: Record<string, Partial<I18nPluginLocaleData>>;
  /**
   * 翻译指南的链接, 为空时不显示
   */
  guideLink?: string;
}

interface I18nPluginTipOptions {
  /**
   * 是否启用提示功能
   * @default true
   */
  enable: boolean;
  /**
   * 提示框容器的 class, 默认值支持默认主题以及 theme-hope
   * @default ["custom-container", "hint-container"]
   */
  containerClass: string[];
  /**
   * 提示标题的 class, 默认值支持默认主题以及 theme-hope
   * @default ["custom-container-title", "hint-container-title"]
   */
  titleClass: string[];
}

interface I18nPluginLocaleData {
  /**
   * @description RFC5646 语言代码
   * @example "en-US", "zh-CN"
   */
  lang: string;
  untranslated: {
    /**
     * @description Title of tips container
     */
    title: string;
    /**
     * 过时页面提示信息
     * @param linkRenderer render link html
     * @param guideLink links to translation guides (ignore the relevant section when empty)
     * @returns localised text
     */
    content: (linkRenderer: typeof RenderLink, guideLink?: string) => string;
  };
  outdated: {
    /**
     * @description Title of warning container
     */
    title: string;
    /**
     * Content of the container
     * @param sourceUpdateTime unix timestamp for source page
     * @param translationUpdateTime unix timestamp for translation page
     * @param sourceLink url of the source page
     * @param linkRenderer render link html
     * @returns localised text
     */
    content: (
      sourceUpdateTime: number,
      translationUpdateTime: number,
      sourceLink: string,
      linkRenderer: typeof RenderLink
    ) => string;
  };
}
```

## License

MIT
