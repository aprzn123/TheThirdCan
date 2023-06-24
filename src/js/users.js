(async() => {
  const src = browser.runtime.getURL("resource/third.js");
  const third = (await import(src)).default;

  third.InjectToggleableScripts({
    stealAvatar: "stealAvatarButton.js",
  }, "users");
})();
