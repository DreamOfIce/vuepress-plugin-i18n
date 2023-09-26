# vuepress-plugin-i18n

适用于 [VuePress v2](https://github.com/vuepress/vuepress-next) 的 i18n 插件

[English version](./README.md)

## 功能

- [x] 填充翻译目录下不存在的页面
- [x] 过时翻译提示(支持 `git`和文件数据源)
- [c] HMR 支持
- [ ] 开发指南

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

## 配置

### 插件选项

```ts
interface I18nPluginOptions {
  /**
   * 源语言版本所在的路径
   * @default "/"
   */
  baseLocalePath?: string;
  /**
   * 页面过滤器, 默认包含主页外所有由 markdown 文件生成的页面
   * @param page VuePress的 page 对象
   * @returns 插件是否应该包含此页面
   */
  filter?: (page: Page) => boolean;
  /**
   * 自定义本地化配置, 应为一个以路径前缀为键，本地化数据为值的对象
   */
  locales?: Record<string, Partial<I18nPluginLocaleData>>;
  /**
   * 向页面添加 tag `untranslated` 或 `outdated`
   * 需在 [vuepress-plugin-blog2]{@link https://www.npmjs.com/package/vuepress-plugin-blog2} 前加载
   * @default false
   */
  tag?: boolean;
  /**
   * 提示功能配置, false 表示禁用
   * @see I18nPluginTipOptions
   * @default true
   */
  tip?: I18nPluginTipOptions | boolean;
  /**
   * 翻译指南的链接, 为空时不显示
   */
  translationGuide?: string;
  /**
   * 当 UpdatedTime 不存在时进行计算
   * - `git`: 从 git 历史读取更新时间
   * - `file`: 从文件信息读取更新时间
   * - 一个函数:
   *   @param page VuePress page 对象
   *   @param app VuePress app
   *   @returns 一个模式名或时间戳
   * @note git 模式可能大幅降低开发服务器启动速度
   * @default (_page, app) => app.env.isBuild || app.env.isDebug ? "git" : undefined
   */
  updatedTime:
    | "git"
    | "file"
    | ((page: Page, app: App) => number | undefined | "git" | "file");
}

interface I18nPluginTipOptions {
  /**
   * 是否启用提示功能
   * @default true
   */
  enable: boolean;
  /**
   * 提示容器的 class, 默认值支持默认主题以及 theme-hope (容器类型始终会被添加)
   * @
   * @default ["custom-container", "hint-container"]
   */
  containerClass: string[];
  /**
   * 提示标题的 class, 默认值支持默认主题以及 theme-hope
   * @default ["custom-container-title", "hint-container-title"]
   */
  titleClass: string[];
  /**
   * 自定义提示组件名称，会被插入到页面顶部
   * 注意: 你需要自行全局导入相应组件
   * @default "I18nTip"
   */
  tipComponent: string;
}
```

### 本地化配置

```ts
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
     * @param translationGuide 翻译指南的链接 (可能为空)
     * @returns 本地化文本
     */
    content: (linkRenderer: LinkRenderer, translationGuide?: string) => string;
  };
  outdated: {
    /**
     * @description 过时页面提示标题
     */
    title: string;
    /**
     * 过时页面提示信息
     * @param linkRenderer 链接渲染工具函数
     * @param sourceUpdateTime 源页面更新时间(unix时间戳)
     * @param translationUpdateTime 翻译更新时间(unix时间戳)
     * @param sourceLink 源页面链接
     * @returns 本地化文本
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
 * 链接渲染工具函数
 * @param text 链接文本
 * @param href 链接url
 * @returns html格式的文本
 */
type LinkRenderer = (text: string, href: string) => string;
```

## Advanced

### Client helper

你可以使用 `useI18nData` 函数引入当前页面的 i18n 信息:

```ts
import { useI18nData } from "vuepress-plugin-i18n/client";

const i18nData = useI18nData(); // 返回一个 I18nData 的计算属性 ref
console.log(i18nData.value);
```

返回的 ref 的值的类型:

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

此函数的一个一大用处是自定义提示组件，示例请参考[默认组件](./src/client/components/I18nTip.vue)的源代码

## License

MIT
