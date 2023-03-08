(async() => {
  const src = browser.runtime.getURL("resource/third.js");
  const third = (await import(src)).default;
  // TODO: import injected utils (perhaps call them "fourth"? :p) 
  // if (document.querySelector("script#THIRD_IMPORT") == null) {
  //   const thirdImport = document.createElement("script");
  //   thirdImport.id = "THIRD_IMPORT";
  //   thirdImport.src = src;
  //   thirdImport.type = "module";
  //   document.body.appendChild(thirdImport)
  // }

  third.InjectToggleableScripts({
    useHotkeys: "hotkeys.js",
    skipConfirm: "skipConfirm.js",
    skipForNow: "skipForNowButton.js"
  })
})();
