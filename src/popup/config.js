const loading = document.getElementById("loading");
const options = document.getElementById("options");
const submit = document.getElementById("submit");

const neverSkipConfirm = document.getElementById("neverSkipConfirm");
const textSkipConfirm = document.getElementById("textSkipConfirm");
const alwaysSkipConfirm = document.getElementById("alwaysSkipConfirm");

const boolTags = [
  "skipForNow",
  "skipSavedQuestions",
  "showPronouns",
  "displayLatex",
  "useHotkeys",
];


function showOptions() {
  loading.style.display = "none";
  options.style.display = "inline";
}

function updateBools(boolTags, value) {
  for (tag of boolTags) {
    document.getElementById(tag).checked = value[tag];
  }
}

function getBools(boolTags) {
  let out = {};
  for (tag of boolTags) {
    out[tag] = document.getElementById(tag).checked;
  }
  return out;
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

  updateBools(boolTags, value);
  showOptions();
});

submit.addEventListener("click", () => {
  let newConfig = getBools(boolTags);
  newConfig.skipConfirm = textSkipConfirm.checked * 1 + alwaysSkipConfirm.checked * 2;
  browser.storage.sync.set(newConfig);
});
