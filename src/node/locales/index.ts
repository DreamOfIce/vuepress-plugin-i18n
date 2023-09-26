import enLocaleData from "./en.js";
import zhLocaleData from "./zh.js";

const locales = [enLocaleData, zhLocaleData];
export default Object.fromEntries(
  locales.map((locale) => [locale.lang, locale]),
);
