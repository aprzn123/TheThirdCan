(async() => {
  const src = browser.runtime.getURL("resource/third.js");
  const third = (await import(src)).default;
  third.InjectToggleableScripts({
    restoreForum: {name: "restoreForum.js", useHead: true, defer: true}
  }, "forum-home");
})();
