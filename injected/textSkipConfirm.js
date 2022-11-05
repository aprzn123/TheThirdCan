//TC.QA.Answer.skip_this(true)
let button = document.querySelector("button.purple");
let textbox = document.getElementById("answer_text");
button.onclick = () => {
  if (textbox.value === "" || confirm("Are you sure you want to skip this question?")) {
    TC.QA.Answer.skip_this(true);
  }
};
