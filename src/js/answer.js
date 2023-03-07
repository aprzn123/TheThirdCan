function enableSkipConfirm(always) {
  third.InjectScript(always ? "alwaysSkipConfirm.js" : "textSkipConfirm.js");
}

function enableHotKeys() {
  let s = document.createElement("script");
  s.src = browser.runtime.getURL("injected/hotkeys.js"); 
  document.body.appendChild(s);
}
function enableSkipForNow() {
  third.InjectScript("skipForNowButton.js")
}

(async() => {
  const src = chrome.runtime.getURL("resource/third.js");
  const third = await import(src);
  console.log(third)
  let results = fetch(third.GetPath("default_settings.json"))
    .then((response) => response.json())
    .then((settings) => browser.storage.sync.get(settings));
results.then((cfg) => {
  
  if (cfg.useHotkeys) {
    enableHotKeys();
  }
  if (cfg.skipConfirm) {enableSkipConfirm(cfg.skipConfirm === 2);}
  if (cfg.skipForNow) {
    enableSkipForNow();
  }
});
