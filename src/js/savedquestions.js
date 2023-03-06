function enableSkipSavedQuestionButton() {
  let s = document.createElement("script");
  s.src = browser.runtime.getURL("injected/skipSavedQuestionButton.js");
  document.body.appendChild(s);
}

let results = fetch(browser.runtime.getURL("injected/default_settings.json"))
    .then((response) => response.json())
    .then((settings) => browser.storage.sync.get(settings));
results.then((cfg) => {
  if (cfg.skipSavedQuestionButton) {
    enableSkipSavedQuestionButton();
  }
});
