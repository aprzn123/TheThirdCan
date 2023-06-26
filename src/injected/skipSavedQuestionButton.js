{
  function addButtons(id) {
    const savedQuestions = document.querySelectorAll("#content_host > div");
    savedQuestions.forEach((questionContainer) => {
      const cfg = fourth.config();

      /** @type {HTMLAnchorElement} */
      let a = questionContainer.querySelector("a");
      // question IDs are always the last 7 digits in the URL.
      let question = a.href.substring(a.href.length - 7);
      let button = document.createElement("button");
      button.innerText = "X";
      button.classList.add("red");
      button.style.marginRight = "8px";
      button.style.width = "2em";
      button.onclick = async () => {
        let shouldSkip = true;
        if (cfg.skipConfirm ?? 0 > 0) {
          shouldSkip = await fourth.Confirm("Confirm", "Are you sure you want to skip this question for now?");
        }
        if (shouldSkip) {
          fetch(`https://twocansandstring.com/api/answer/${id}/skip/${question}/1/0`);
          questionContainer.remove();
        }
      };
      questionContainer.insertBefore(button, a);
    });
  }

  fourth.UserId().then(addButtons);
}
