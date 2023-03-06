let answerButton = document.querySelector("#content_host table tr").childNodes[1].childNodes[1].childNodes[0];
let saveButton = document.querySelector("#content_host table tr").childNodes[1].childNodes[1].childNodes[1];
let skipButton = document.querySelector("#content_host table tr").childNodes[1].childNodes[1].childNodes[2];

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key == "Enter") {
    answerButton.click();
  }

  else if (event.ctrlKey && event.key == "s") {
    event.preventDefault();
    saveButton.click();
  }

  else if (event.ctrlKey && event.key == "m") {
    skipButton.click();
  }

});