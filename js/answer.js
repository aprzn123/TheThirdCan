let settings = {
  "skipConfirm": 0
};

function enableSkipConfirm(always) {
  let s = document.createElement("script");
  if (always) { s.src = browser.runtime.getURL("injected/alwaysSkipConfirm.js"); }
  else { s.src = browser.runtime.getURL("injected/textSkipConfirm.js"); }
  document.body.appendChild(s);
}

let results = browser.storage.sync.get(settings);
results.then((cfg) => {
  if (cfg.skipConfirm) {enableSkipConfirm(cfg.skipConfirm === 2);}
});
