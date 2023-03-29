import type { I18nPluginLocaleData } from "../../shared/types.js";

const zhLocaleData: I18nPluginLocaleData = {
  lang: "zh-CN",
  untranslated: {
    title: "提示",
    content: (linkRenderer, guideLink) =>
      `此页面尚未翻译${
        guideLink
          ? `，在${linkRenderer("此处", guideLink)}了解如何帮我们翻译`
          : ""
      }。`,
  },
  outdated: {
    title: "警告",
    content: (
      linkRenderer,
      sourceUpdateTime,
      translationUpdateTime,
      sourceLink
    ) => {
      const getDateString = (timestamp: number) => {
        const date = new Date(timestamp);
        return `${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日`;
      };
      return `本页面最后修改于${getDateString(
        translationUpdateTime
      )}，原文已在${getDateString(sourceUpdateTime)}更新。${linkRenderer(
        "查看原文",
        sourceLink
      )}`;
    },
  },
};

export default zhLocaleData;
