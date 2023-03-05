const settings = fetch(browser.runtime.getURL("injected/default_settings.json"))
    .then((response) => response.json())
    .then((settings) => browser.storage.sync.get(settings));
settings.then((cfg) => {
  window.localStorage.setItem("cfg", JSON.stringify(cfg));
});
