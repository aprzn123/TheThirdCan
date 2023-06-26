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
    "stealAvatar",
    "answerFocus",
    "restoreForum",
    "useBinoculars"
  ],
  radioTags: [
    "skipConfirm",
  ]
};


function showOptions() {
  loading.style.display = "none";
  options.style.display = "inline";
}

function loadSettings(tags, settings) {
  for (const tag of tags.boolTags) {
    document.getElementById(tag).checked = settings[tag];
  }
  for (const tag of tags.radioTags) {
    Array.from(document.getElementById(tag).children)
         .filter(child => child.tagName === "INPUT"
                       && child.type === "radio"
                       && settings[tag] === parseInt(child.dataset.enumerated)
         ).map(i => i.checked = true);
  }
}

function getSettingsFromHtml(tags) {
  let out = {};
  for (const tag of tags.boolTags) {
    out[tag] = document.getElementById(tag).checked;
  }
  for (const tag of tags.radioTags) {
    out[tag] = parseInt(Array.from(document.getElementById(tag).children)
                    .filter((child) => child.tagName === "INPUT"
                                       && child.type === "radio"
                                       && child.checked
                    )[0].dataset.enumerated);
  }
  return out;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch(browser.runtime.getURL("injected/default_settings.json"))
      .then((response) => response.json())
      .then((settings) => browser.storage.sync.get(settings))
      .then((value) => {
        loadSettings(tags, value);
        showOptions();
      });
});

submit.addEventListener("click", () => {
  let newConfig = getSettingsFromHtml(tags);
  console.log(newConfig);
  browser.storage.sync.set(newConfig);
});
