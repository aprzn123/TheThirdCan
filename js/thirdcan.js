let settings = {
  "skipConfirm": 0
};

let results = browser.storage.sync.get(settings);
results.then((cfg) => {
});
