const ttcSettings = fetch(browser.runtime.getURL("injected/default_settings.json"))
    .then((response) => response.json())
    .then((settings) => browser.storage.sync.get(settings));
ttcSettings.then((cfg) => {
  window.localStorage.setItem("cfg", JSON.stringify(cfg));
});
