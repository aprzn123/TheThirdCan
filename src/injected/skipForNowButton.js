let purpleButton = document.querySelector("button.purple");
let buttonArea = purpleButton.parentElement;
let skipForNowButton = document.createElement("button");
skipForNowButton.innerText = "Skip for now";
buttonArea.insertBefore(skipForNowButton, purpleButton.nextSibling);

// hacky way to get user id
const attr = document.querySelector("body").getAttribute("onload");
const userID = Number(attr.substring(18, attr.length - 1));

skipForNowButton.onclick = () => {
  // TODO: replace this logic to check if user has skip confirmation enabled
  if (textbox.value === "" || confirm("Are you sure you want to skip this question? for now")) {
    // the best way to get a new question would be to reinit the QA  otherwise I would have to
    // rewrite all of the website's scripts
    TC.QA.Answer.init(userID);
  }
};
