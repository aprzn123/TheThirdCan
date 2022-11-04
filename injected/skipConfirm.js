//TC.QA.Answer.skip_this(true)
let button = document.querySelector("button.purple");
button.onclick = () => {
  if (confirm("test")) {
    TC.QA.Answer.skip_this(true);
  }
};
