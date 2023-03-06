{
  // NOTE: i think this should be put in a separate utils file for scripts that
  // need to access the user id for whatever reason but can't
  function getUserId() {
    return new Promise((resolve, reject) => {
      TC.Legacy.getPage("/answer", (html) => {
        html = html.substring(html.indexOf("TC.QA.Answer.init"));
        html = html.substring(html.indexOf("(") + 1);
        html = html.substring(0, html.indexOf(")"));
        resolve(html);
      });
      //reject("Unable to find user ID.");
    });
  } 

  function addButtons(id) {
    const savedQuestions = document.querySelectorAll("#content_host > div");
    savedQuestions.forEach((questionContainer) => {
      const cfgStr = window.sessionStorage.getItem("ttcConfigState");
      const cfg = JSON.parse(cfgStr);

      /** @type {HTMLAnchorElement} */
      let a = questionContainer.querySelector("a");
      // question IDs are always the last 7 digits in the URL.
      let question = a.href.substring(a.href.length - 7);
      let button = document.createElement("button");
      button.innerText = "Remove";
      button.classList.add("red");
      button.onclick = () => {
        let shouldSkip = true;
        if (cfg.skipConfirm ?? 0 > 0) {
          shouldSkip = confirm("Are you sure you want to skip this question for now?");
        }
        if (shouldSkip) {
          fetch(`https://twocansandstring.com/api/answer/${id}/skip/${question}/1/0`);
          questionContainer.remove();
        }
      };
      questionContainer.append(button);
    });
  }

  getUserId().then(addButtons);
}
