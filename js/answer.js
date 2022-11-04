let settings = {
  "skipConfirm": false
};

function enableSkipConfirm() {
  let s = document.createElement("script");
  s.src = browser.runtime.getURL("injected/skipConfirm.js");
  document.body.appendChild(s);
}

let results = browser.storage.sync.get(settings);
results.then((cfg) => {
  if (cfg.skipConfirm) {enableSkipConfirm();}
});
