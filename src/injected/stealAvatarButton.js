{
  function getUserId() {
    return new Promise((resolve, reject) => {
      // timeout after 5000 milliseconds
      const timeout = window.setTimeout(5000, () => reject("Unable to find user ID."));

      TC.Legacy.getPage("/answer", (html) => {
        html = html.substring(html.indexOf("TC.QA.Answer.init"));
        html = html.substring(html.indexOf("(") + 1);
        html = html.substring(0, html.indexOf(")"));
        window.clearTimeout(timeout);
        resolve(html);
      });
    });
  } 

  function drawImageToNewCanvas(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    let drawingStr = "";
    const imageData = ctx.getImageData(0, 0, 96, 96);
    console.log(imageData);
    for (let y = 0; y < 96; y += 3) {
      for (let x = 0; x < 96; x += 3) {
        const idx = (x + y * 96) * 4;
        const [r, g, b] = imageData.data.subarray(idx, idx + 3);
        console.log(`(${x / 3}, ${y / 3}) = ${r} ${g} ${b}`);
        const hex = [r, g, b].map((a) => a.toString(16).padStart(2, "0")).reduce((a, b) => a + b);
        drawingStr += hex;
      }
    }
    return drawingStr;
  }

  function stealAvatar() {
    const img = document.querySelector("#content_host div > img");
    console.log(img);
    const data = drawImageToNewCanvas(img);
    getUserId().then((id) => {
      fetch(`https://twocansandstring.com/drawing/api/${id}/saveimage/1/0/0`,
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            data,
          }),
        })
        .then(() => console.log(data.length));
    });
  }

  const button = document.createElement("button");
  button.innerText = "Steal Avatar";
  const followButton = document.querySelector("#content_host div > button");
  followButton.parentElement.appendChild(button);
  button.onclick = () => stealAvatar();
}
