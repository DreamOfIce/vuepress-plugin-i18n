import type { App } from "@vuepress/core";
import { colors } from "@vuepress/utils";
import type { I18nPluginLocaleData } from "../../shared/types.js";
import type { I18nPluginInternalOptions } from "../options.js";
import { logger } from "../utils.js";

const keyRegExp = /^(?!\d)[a-z0-9_]+/i;
/**
 * Generate code string
 * @param input any javascript value
 * @returns restored string
 */
const getCodeStr: (input: unknown) => string = (input) => {
  switch (typeof input) {
    case "string":
      return `"${input}"`;
    case "number":
    case "boolean":
    case "function":
      return (
        input as number | boolean | ((...args: never[]) => never)
      ).toString();
    case "object": {
      if (input === null) return "null";
      else if (input instanceof Array) {
        return `[${input.map((m) => getCodeStr(m)).join(",")}]`;
      } else
        return `{${Object.entries(input)
          .map(
            ([key, value]) =>
              `${keyRegExp.exec(key) ? key : `"${key}"`}: ${getCodeStr(value)}`
          )
          .join(",")}}`;
    }
    default:
      return `"${input?.toString() ?? "null"}"`;
  }
};

const gettranslationGuides = (app: App, translationGuide?: string) => {
  if (!translationGuide || !translationGuide.startsWith("/"))
    return { "/": translationGuide };
  const links: Record<string, string> = { "/": translationGuide };
  app.pages.forEach((page) => {
    if (page.path === translationGuide.replace("/", page.pathLocale))
      links[page.pathLocale] = page.path;
  });
  return links;
};

const writeLocales = async (
  app: App,
  locales: Record<string, I18nPluginLocaleData>,
  { translationGuide }: I18nPluginInternalOptions
) => {
  await app.writeTemp(
    "i18n-locales.js",
    `export const translationGuides = ${getCodeStr(
      gettranslationGuides(app, translationGuide)
    )};
    export const locales = ${getCodeStr(locales)};`
  );
  if (app.env.isDebug)
    logger.info(
      `I18n plugin locales has been written to ${colors.green(
        app.dir.temp("i18n-locales.js")
      )}`
    );
};

export { writeLocales };
