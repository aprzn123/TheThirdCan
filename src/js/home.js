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
})})();
