import type { App } from "@vuepress/core";
import { colors } from "@vuepress/utils";
import type { I18nPluginLocaleData } from "../../shared/types";
import type { I18nPluginInternalOptions } from "../options";
import { logger } from "../utils";

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

const getGuideLinks = (app: App, guideLink?: string) => {
  if (!guideLink || !guideLink.startsWith("/")) return { "/": guideLink };
  const links: Record<string, string> = { "/": guideLink };
  app.pages.forEach((page) => {
    if (page.path === guideLink.replace("/", page.pathLocale))
      links[page.pathLocale] = page.path;
  });
  return links;
};

const writeLocales = async (
  app: App,
  locales: Record<string, I18nPluginLocaleData>,
  { guideLink }: I18nPluginInternalOptions
) => {
  const md = app.markdown;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalNormalizeLink = md.normalizeLink; // avoid escapes
  md.normalizeLink = (url) => url;
  await app.writeTemp(
    "i18n-locales.js",
    `export const guideLinks = ${getCodeStr(getGuideLinks(app, guideLink))};
    export const linkRenderer = (text, href) => \`${md.renderInline(
      "[${text}](${href})"
    )}\`;
    export const locales = ${getCodeStr(locales)};`
  );
  md.normalizeLink = originalNormalizeLink;
  logger(
    "info",
    `I18n plugin locales has been written to ${colors.green(
      app.dir.temp("i18n-locales.js")
    )}`
  );
};

export { writeLocales };
