const loading = document.getElementById("loading");
const options = document.getElementById("options");
const submit = document.getElementById("submit");

const tags = {
  boolTags: [
    "skipForNow",
    "skipSavedQuestions",
    "showPronouns",
    "displayLatex",
    "useHotkeys",
  ],
  radioTags: [
    "skipConfirm",
  ]
};


function showOptions() {
  loading.style.display = "none";
  options.style.display = "inline";
}

function loadSettings(tags, value) {
  for (const tag of tags.boolTags) {
    document.getElementById(tag).checked = value[tag];
  }
  for (const tag of tags.radioTags) {
    const inputs = Array.from(document.getElementById(tag).children)
    .filter(child => child.tagName === "INPUT" && child.type === "radio");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].checked = value[tag] === i;
    }
  }
}

function getSettings(tags) {
  let out = {};
  for (const tag of tags.boolTags) {
    out[tag] = document.getElementById(tag).checked;
  }
  for (const tag of tags.radioTags) {
    const inputs = Array.from(document.getElementById(tag).children)
    .filter((child) => child.tagName === "INPUT" && child.type === "radio");
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        out[tag] = i;
      }
    }
  }
  return out;
}

document.addEventListener("DOMContentLoaded", () => {
  let results = fetch(browser.runtime.getURL("injected/default_settings.json"))
      .then((response) => response.json())
      .then((settings) => browser.storage.sync.get(settings));
  results.then((value) => {
    loadSettings(tags, value);
    showOptions();
  });
});

submit.addEventListener("click", () => {
  let newConfig = getSettings(tags);
  browser.storage.sync.set(newConfig);
});
