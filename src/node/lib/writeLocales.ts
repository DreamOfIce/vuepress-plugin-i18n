import type { App } from "@vuepress/core";
import type { I18nPluginLocaleData } from "../../shared/types";
import { logger } from "../utils";

const keyRegExp = /^(?!\d)[a-z0-9_]+/i;

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

const writeLocales = async (
  app: App,
  locales: Record<string, I18nPluginLocaleData>
) => {
  await app.writeTemp(
    "i18n-locales.js",
    `export const linkRenderer = (text: string, href: string) => \`${app.markdown.renderInline(
      "[${text}]($href}"
    )}\`;
    export const locales = ${getCodeStr(locales)};`
  );
  logger("info", "I18n plugin locales has been written.");
};

export { writeLocales };
