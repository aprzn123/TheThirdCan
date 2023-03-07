const feedElement = document.getElementsByClassName("box_top")[3];

if (feedElement.childNodes[0].innerHTML === "Feed") {
  feedElement.style.display = "none";
} else {
  console.warn('warning: did not find the  feed element');
} 