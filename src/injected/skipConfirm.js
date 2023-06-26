(async() => {
  const cfg = fourth.config();
  const enums = await fourth.enums;
  const always = cfg.skipConfirm === enums.skipConfirm.ALWAYS;
  let button = document.querySelector("button.purple");
  let textbox = document.getElementById("answer_text");
  button.onclick = async () => {
    if ((textbox.value === "" && !always) || await fourth.Confirm("Confirm", "Are you sure you want to skip this question?")) {
      TC.QA.Answer.skip_this(true);
    }
  };
})();
