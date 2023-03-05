fetch(browser.runtime.getURL("injected/default_settings.json"))
    .then((response) => response.json())
    .then((settings) => browser.storage.sync.get(settings))
    .then((settings) => JSON.stringify(settings))
    .then((state) => window.sessionStorage.setItem("ttcConfigState", state));
