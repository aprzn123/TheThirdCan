(async() => {
  const cfg = fourth.config();
  const enums = await fourth.enums;
  const always = cfg.skipConfirm === enums.skipConfirm.ALWAYS;
  let button = document.querySelector("button.purple");
  let textbox = document.getElementById("answer_text");
  button.onclick = () => {
    if ((textbox.value === "" && !always) || confirm("Are you sure you want to skip this question?")) {
      TC.QA.Answer.skip_this(true);
    }
  };
})();
