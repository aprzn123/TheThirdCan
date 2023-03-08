function enableSkipConfirm(third, always) {
  third.InjectScript(always ? "alwaysSkipConfirm.js" : "textSkipConfirm.js");
}

function enableHotKeys(third) {
  third.InjectScript("hotkeys.js")
}
function enableSkipForNow(third) {
  third.InjectScript("skipForNowButton.js")
}

(async() => {
  const src = browser.runtime.getURL("resource/third.js");
  const third = (await import(src)).default;
  if (document.querySelector("script#THIRD_IMPORT") == null) {
    const thirdImport = document.createElement("script");
    thirdImport.id = "THIRD_IMPORT";
    thirdImport.src = src;
    thirdImport.type = "module";
    document.body.appendChild(thirdImport)
  }
  let results = third.GetSettings()
    .then((response) => response.json())
    .then((settings) => browser.storage.sync.get(settings));
results.then((cfg) => {
  
  if (cfg.useHotkeys) {
    enableHotKeys(third);
  }
  if (cfg.skipConfirm) {enableSkipConfirm(third, cfg.skipConfirm === 2);}
  if (cfg.skipForNow) {
    enableSkipForNow(third);
  }
})})();
