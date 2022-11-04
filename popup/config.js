const loading = document.getElementById("loading");
const options = document.getElementById("options");
const skipConfirm = document.getElementById("skip-confirmation");
const submit = document.getElementById("submit");

let settings = {
  "skipConfirm": false
};

function showOptions() {
  loading.style.display = "none";
  options.style.display = "inline";
}

let results = browser.storage.sync.get(settings);

results.then((value) => {
  console.log(value);
  skipConfirm.checked = value.skipConfirm;
  showOptions();
});

submit.addEventListener("click", () => {
  browser.storage.sync.set({
    "skipConfirm": skipConfirm.checked
  });
});
