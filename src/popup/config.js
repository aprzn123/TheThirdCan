const loading = document.getElementById("loading");
const options = document.getElementById("options");
const neverSkipConfirm = document.getElementById("neverSkipConfirm");
const textSkipConfirm = document.getElementById("textSkipConfirm");
const alwaysSkipConfirm = document.getElementById("alwaysSkipConfirm");
const skipForNow = document.getElementById("skipForNow");
const submit = document.getElementById("submit");
const showPronouns = document.getElementById("showPronouns");
const displayLatex = document.getElementById("displayLatex");


function showOptions() {
  loading.style.display = "none";
  options.style.display = "inline";
}

let results = fetch(browser.runtime.getURL("injected/default_settings.json"))
    .then((response) => response.json())
    .then((settings) => browser.storage.sync.get(settings));
results.then((value) => {
  console.log(value);
  if (value.skipConfirm === 0) {neverSkipConfirm.checked = true;}
  else if (value.skipConfirm === 1) {textSkipConfirm.checked = true;}
  else if (value.skipConfirm === 2) {alwaysSkipConfirm.checked = true;}
  else {console.error(`skipConfirm was ${value.skipConfirm}, which is neither 0, 1, nor 2`);}

  skipForNow.checked = value.skipForNow;

  showPronouns.checked = value.showPronouns,
  displayLatex.checked = value.displayLatex,

  showOptions();
});

submit.addEventListener("click", () => {
  browser.storage.sync.set({
    "skipConfirm": textSkipConfirm.checked * 1 + alwaysSkipConfirm.checked * 2,
    "skipForNow": skipForNow.checked,
    "showPronouns": showPronouns.checked,
    "displayLatex": displayLatex.checked
  });
});
