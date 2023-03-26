import type { I18nPluginLocaleData } from "../../shared/types.js";

const enLocaleData: I18nPluginLocaleData = {
  lang: "en-US",
  untranslated: {
    title: "Notice",
    content: (linkRenderer, guideLink) =>
      `This page has not yet been translated${
        guideLink
          ? `, see how you can help ${linkRenderer("here", guideLink)}`
          : ""
      }.`,
  },
  outdated: {
    title: "Warning",
    content: (sourceTime, translationTime, sourceLink, linkRenderer) => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ] as const;

      const getDateString = (timestamp: number) => {
        const date = new Date(timestamp);
        return `${date.getDate()} ${
          months[date.getMonth()] as string
        } ${date.getFullYear()}`;
      };

      return `This translation was modified on ${getDateString(
        translationTime
      )} and an updated version (${getDateString(
        sourceTime
      )}) is available on the source page. ${linkRenderer(
        "View the original page",
        sourceLink
      )}`;
    },
  },
};
export default enLocaleData;
