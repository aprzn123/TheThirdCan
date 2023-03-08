(async() => {
  const src = browser.runtime.getURL("resource/third.js");
  const third = (await import(src)).default;

  third.InjectToggleableScripts({
    useHotkeys: "hotkeys.js",
    skipConfirm: "skipConfirm.js",
    skipForNow: "skipForNowButton.js"
  }, "answer")
})();
