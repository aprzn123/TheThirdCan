const loading = document.getElementById("loading");
const options = document.getElementById("options");
const neverSkipConfirm = document.getElementById("neverSkipConfirm");
const textSkipConfirm = document.getElementById("textSkipConfirm");
const alwaysSkipConfirm = document.getElementById("alwaysSkipConfirm");
const submit = document.getElementById("submit");

let settings = {
  "skipConfirm": 0 // 0: never | 1: with text | 2: always
};

function showOptions() {
  loading.style.display = "none";
  options.style.display = "inline";
}

let results = browser.storage.sync.get(settings);

results.then((value) => {
  console.log(value);
  if (value.skipConfirm === 0) {neverSkipConfirm.checked = true;}
  else if (value.skipConfirm === 1) {textSkipConfirm.checked = true;}
  else if (value.skipConfirm === 2) {alwaysSkipConfirm.checked = true;}
  else {console.error(`skipConfirm was ${value.skipConfirm}, which is neither 0, 1, nor 2`);}
  showOptions();
});

submit.addEventListener("click", () => {
  browser.storage.sync.set({
    "skipConfirm": textSkipConfirm.checked * 1 + alwaysSkipConfirm.checked * 2
  });
});
