import type i18nPluginLocaleData from "./types.js";

const getDateString = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日`;
};
const zhLocaleData: i18nPluginLocaleData = {
  lang: "zh-CN",
  untranslated: {
    title: "提示",
    content: (guideLink) =>
      `此页面尚未翻译，在[此处](${guideLink}了解如何帮我们翻译~`,
  },
  outdated: {
    title: "警告",
    content: (sourceUpdateTime, translationUpdateTime, sourceLink) =>
      `本页面最后修改于${getDateString(
        translationUpdateTime
      )}，原文已在${getDateString(
        sourceUpdateTime
      )}更新。[查看原文](${sourceLink})`,
  },
};

export { zhLocaleData };
