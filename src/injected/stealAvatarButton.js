{
  function drawImageToNewCanvas(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    ctx.imageSmoothingEnabled = false; // no AA

    const imageData = ctx.getImageData(0, 0, 96, 96);

    let drawingStr = "";
    for (let y = 0; y < 96; y += 3) {
      for (let x = 0; x < 96; x += 3) {
        // 1 char each for r, g, b, a
        const idx = (x + y * 96) * 4;
        const [r, g, b] = imageData.data.subarray(idx, idx + 3);
        const hex = [r, g, b].map((a) => a.toString(16).padStart(2, "0")).reduce((a, b) => a + b);
        drawingStr += hex;
      }
    }
    return drawingStr;
  }

  function stealAvatar() {
    const img = document.querySelector("#content_host div > img");
    const data = drawImageToNewCanvas(img);
    // there should be a way to cache the user's id so we do not have to pass an `id` parameter
    // to API functions
    fourth.UserId()
        .then((id) => fourth.SaveAvatar(id, data));
  }

  const button = document.createElement("button");
  button.innerText = "Steal Avatar";
  const followButton = document.querySelector("#content_host div > button");
  followButton.parentElement.appendChild(button);
  button.onclick = () => stealAvatar();
}
