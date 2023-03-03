//TC.QA.Answer.skip_this(true)
let button = document.querySelector("button.purple");
button.onclick = () => {
  if (confirm("Are you sure you want to skip this question?")) {
    TC.QA.Answer.skip_this(true);
  }
};
