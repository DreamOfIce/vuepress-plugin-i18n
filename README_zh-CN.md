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
     * @description 未翻译页面提示标题
     */
    title: string;
    /**
     * 未翻译页面提示信息
     * @param linkRenderer 链接渲染工具函数
     * @param guideLink 翻译指南的链接 (可能为空)
     * @returns 本地化文本
     */
    content: (linkRenderer: typeof RenderLink, guideLink?: string) => string;
  };
  outdated: {
    /**
     * @description 过时页面提示标题
     */
    title: string;
    /**
     * 过时页面提示信息
     * @param sourceUpdateTime 源页面更新时间(unix时间戳)
     * @param translationUpdateTime 翻译更新时间(unix时间戳)
     * @param sourceLink 源页面链接
     * @param linkRenderer 链接渲染工具函数
     * @returns 本地化文本
     */
    content: (
      sourceUpdateTime: number,
      translationUpdateTime: number,
      sourceLink: string,
      linkRenderer: typeof RenderLink
    ) => string;
  };
}

/**
 * 链接渲染工具函数
 * @param text 链接文本
 * @param href 链接url
 * @returns html格式的文本
 */
declare function RenderLink(text: string, href: string): string;
```

## License

MIT