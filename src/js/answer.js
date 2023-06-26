function enableRefocus() {
  document.getElementById("answer_text").focus();
  let buttons = document.querySelectorAll('#content_host > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > button');
  for (let button of buttons) {
    button.addEventListener("click", () => {
      document.getElementById("answer_text").focus();
    });
  }
}

(async() => {
  const src = browser.runtime.getURL("resource/third.js");
  const third = (await import(src)).default;

  if ((await third.GetSettings()).answerFocus) {
    enableRefocus();
  }

  third.InjectToggleableScripts({
    useHotkeys: "hotkeys.js",
    skipConfirm: "skipConfirm.js",
    skipForNow: "skipForNowButton.js"
  }, "answer")
})();
