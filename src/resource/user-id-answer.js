fourth.UserId = function() {
  return new Promise((resolve, reject) => {
    const attr = document.querySelector("body").getAttribute("onload");
    const userId = attr.substring(18, attr.length - 1);
    resolve(Number(userId))
  })
}
