import type { App } from "@vuepress/core";
import { checkGitRepo, getUpdatedTime } from "@vuepress/plugin-git";
import utils from "@vuepress/utils";
import type { i18nPluginInternalOptions } from "../options.js";
import {
  chooseLocaleData,
  createContainer,
  getLanguage,
  isSourcePage,
} from "./helper.js";

async function addOutdatedTips(app: App, options: i18nPluginInternalOptions) {
  if (!options.addTips && !options.addTag) return;
  const siteLocales = app.siteData.locales;
  const translationPrefixs = Object.keys(siteLocales).filter(
    (path) => path !== "/"
  );
  const cwd = app.dir.source();
  if (!checkGitRepo(cwd)) {
    utils.warn(
      "Not a git repository, skips detection of outdated translations."
    );
    return;
  }
  for (const page of app.pages) {
    if (
      isSourcePage(page, translationPrefixs) ||
      page.frontmatter["home"] === true
    )
      continue;
    const langPrefix = getLanguage(page.path, translationPrefixs);
    const translationPath = page.path;
    const sourcePath = translationPath.replace(langPrefix, "/");
    const translationFilePath = page.filePathRelative;
    const sourceFilePath = app.pages.find(
      (p) => p.path === sourcePath
    )?.filePathRelative;
    if (!translationFilePath || !sourceFilePath) return;
    const sourceUpdateTime = await getUpdatedTime([sourceFilePath], cwd);
    const translationUpdateTime = await getUpdatedTime(
      [translationFilePath],
      cwd
    );
    if (sourceUpdateTime > translationUpdateTime) {
      const { outdated } = chooseLocaleData(
        app.siteData,
        options.locales,
        page.path,
        langPrefix
      );
      if (options.addTips) {
        page.content =
          createContainer(
            "warning",
            outdated.title,
            outdated.content(
              sourceUpdateTime,
              translationUpdateTime,
              sourcePath
            )
          ) + page.content;
      }
      if (options.addTag) {
        page.frontmatter["tag"] ||= [];
        (page.frontmatter["tag"] as Array<string>).push("translation-outdated");
      }
    }
  }
}

export { addOutdatedTips };
