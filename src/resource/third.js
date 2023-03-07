const third = {};

/**
 * Returns the path of an injected script (located in the `/injected` directory).
 * @param {string} path 
 * @returns {string} The full path to the script.
 */
third.GetPath = function(path) {
  if (typeof path !== "string") {
    console.error("Script path must be a string in injection");
    return;
  }
  return browser.runtime.getURL(`injected/${path}`);
}

/**
 * Inserts a script tag in the page that links to an extension script
 * @param {string} path The path to the script file to be injected. Should be in the `/injected` directory.
 * @returns {HTMLScriptElement}
 */
third.InjectScript = function(path) {
  const el = document.createElement("script");
  el.src = third.GetPath(path);
  //el.type = "module";
  document.body.append(el);
  return el;
}

/**
 * Creates a popup window that can be closed.
 * @param {string} title
 * @param {string} data
 */
third.Alert = function(title, data) {
  // WIP
  if (typeof title !== "string" || typeof data !== "string") {
    console.error("Alert popup fields must be a string");
    return;
  }
  const bgEl = document.createElement("div");
  bgEl.style = "position:absolute;width:100vw;height:100vh;top:0;left:0;background:rgba(0,0,0,0.7);";
  const alertEl = document.createElement("div");
  bgEl.appendChild(alertEl)
  document.body.append(bgEl);
}

export default third;