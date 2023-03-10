{
  let textbox = document.getElementById("answer_text");
  let purpleButton = document.querySelector("button.purple");
  let buttonArea = purpleButton.parentElement;
  let skipForNowButton = document.createElement("button");
  skipForNowButton.innerText = "Skip for now";
  buttonArea.insertBefore(skipForNowButton, purpleButton.nextSibling);

  function shouldSkip() {
    const cfg = fourth.config();
    if (cfg.skipConfirm !== undefined) {
      // check if user enabled skip confirmation. if so, prompt for confirmation
      // if necessary according to the user's settings
      if ((cfg.skipConfirm === 1 && textbox.value !== "") || cfg.skipConfirm === 2) {
        return confirm("Are you sure you want to skip this question for now?");
      }
    }
    return true;
  }


  (async () => {
    let userID = await fourth.UserId();

    skipForNowButton.onclick = () => {
      if (shouldSkip()) {
        // the best way to get a new question would be to reinit the QA
        TC.QA.Answer.init(userID);
        textbox.value = "";
      }
    };
  })();
}
