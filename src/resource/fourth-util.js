/**
 * Creates a popup window that can be closed. Supports multiple buttons.
 * @param {string} title
 * @param {string} content
 * @param {{ text: string, color?: [string, string], callback: () => any }[]} buttons An array of buttons containing text and functions to run when the button is clicked. For more information view the `fourth` docs.
 */
fourth.Alert = function(title, content, buttons = []) {
  return new Promise((resolve, reject) => {
    if (typeof title !== "string" || typeof content !== "string") {
      reject("Alert popup fields must be a string");
      return;
    }
    const bgEl = document.createElement("div");
    bgEl.style = "position:fixed;width:100%;height:100vh;top:0;left:0;background:rgba(0,0,0,0.7);";
    document.body.style.overflow = "hidden" // should be made less brute-forcey

    const alertEl = document.createElement("div");
    alertEl.style = "position:absolute;height:auto;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:8px;";
    alertEl.innerHTML = `<div style="background:#444;height:auto;color:white;padding:0.5em;border-radius:8px 8px 0 0;word-wrap:break-word;">${title}</div><div style="padding:0.5em;text-align:left;">${content}</div>`;

    const closeEl = document.createElement("a");
    closeEl.href = "javascript:void(0)";
    closeEl.innerHTML = "&#10005;";
    closeEl.style = "font-weight:bold;position:absolute;display:block;top:8.5%;right:5%;color:white;";
    closeEl.addEventListener("click", () => {
      bgEl.remove();
      resolve(false);
    });

    alertEl.appendChild(closeEl)
    bgEl.appendChild(alertEl)
    document.body.append(bgEl);

    if (buttons.length > 0) {
      for (let button of buttons) {
        button.color = button.color || ["#0080ff", "#0060e0"]
        const b = document.createElement("button");
        b.innerHTML = button.text;
        b.style.background = `linear-gradient(${button.color.join(", ")})`;
        b.style.marginRight = "0.25em";
        b.onclick = () => {
          bgEl.remove();
          resolve(button.callback());
        }
        alertEl.appendChild(b);
      }
    } else {
      resolve(true);
    }
  })
};

/**
 * Creates a confirmation window, asking the user to confirm an action and returning `true` if "Yes" is clicked; `false` otherwise.
 */
fourth.Confirm = function(title, content) {
  return fourth.Alert(title, content, [
    {
      text: "Yes",
      callback: () => true
    },
    {
      text: "No",
      color: ["#a00", "#800"],
      callback: () => false
    }
  ]);
};
