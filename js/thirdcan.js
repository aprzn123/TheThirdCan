let settings = {
  "skipConfirm": false
};

let results = browser.storage.sync.get(settings);
results.then((cfg) => {
});
