import type { App } from "@vuepress/core";
import type { I18nPluginLocaleData } from "../../shared/types";

const writeLocales = async (
  app: App,
  locales: Record<string, I18nPluginLocaleData>
) =>
  await app.writeTemp(
    "i18n-locales.js",
    `export const locales =${JSON.stringify(locales, (_key, value) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      typeof value === "function" ? value.toString() : value
    )}`
  );

export { writeLocales };
