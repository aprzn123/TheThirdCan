{
  const cfg = fourth.config();
  const always = cfg.skipConfirm === 2;
  let button = document.querySelector("button.purple");
  let textbox = document.getElementById("answer_text");
  button.onclick = () => {
    if ((textbox.value === "" && !always) || confirm("Are you sure you want to skip this question?")) {
      TC.QA.Answer.skip_this(true);
    }
  };
}

