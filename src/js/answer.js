function enableSkipConfirm(always) {
  let s = document.createElement("script");
  if (always) { s.src = browser.runtime.getURL("injected/alwaysSkipConfirm.js"); }
  else { s.src = browser.runtime.getURL("injected/textSkipConfirm.js"); }
  document.body.appendChild(s);
}

function enableHotKeys() {
  let s = document.createElement("script");
  s.src = browser.runtime.getURL("injected/hotkeys.js"); 
  document.body.appendChild(s);
}
function enableSkipForNow() {
  let s = document.createElement("script");
  s.src = browser.runtime.getURL("injected/skipForNowButton.js");
  document.body.appendChild(s);
}

let results = fetch(browser.runtime.getURL("injected/default_settings.json"))
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
