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
 * @param {object} options Additional options.
 * @returns {HTMLScriptElement}
 */
third.InjectScript = function(path, options) {
  // note that options shouldn't have a "name" property, to keep the code for third.InjectToggleableScripts simpler.
  options = options || {}
  const el = document.createElement("script");
  el.src = third.GetPath(path);
  el.type = "text/javascript";
  el.async = options.noAsync ? false : true;
  // Why not always use head?
  (options.useHead ? document.head : document.body).append(el);
  return el;
}

/**
 * Calls third.InjectScript on multiple scripts in a batch, only when the corresponding configuration options are truthy.
 * @param {object} scripts An Object where keys are setting names and values are either injectable script names, objects with options (script name in "name" key), or arrays of these.
 * @param {string} caller The name of the content script calling the function
 */
third.InjectToggleableScripts = async function(scripts, caller) {
  const settings = await third.GetSettings();
  const scriptsToInject = Object.entries(scripts).filter((entry) => settings[entry[0]]).map((entry) => entry[1]);
  if (scriptsToInject.length == 0) { return; }
  // TODO: Inject polyfilled utilities relevant to the content script
  for (const script of scriptsToInject) {
    if (typeof script === "string") {
      third.InjectScript(script);
    } else if (Array.isArray(script)) {
      for (const trueScript of script) {
        if (typeof trueScript === "string") {
          third.InjectScript(trueScript);
        } else if (typeof trueScript === "object") {
          third.InjectScript(trueScript.name, trueScript);
        } else {
          // TODO: Throw error, see below
        }
      }
    } else if (typeof script === "object") {
      third.InjectScript(script.name, script);
    } else {
      // TODO: Throw error? idk how js handles that 
    }
  }
}

/**
 * Gets the current settings.
 * @returns {Promise}
 */
third.GetSettings = async function() {
  return fetch(third.GetPath("default_settings.json"))
        .then((response) => response.json())
        .then((settings) => browser.storage.sync.get(settings));
}

/**
 * Gets the ID of the current user.
 * @returns {Promise<string>}
 */
third.GetUserID = function() {
  return new Promise((resolve, reject) => {
    // timeout after 5000 milliseconds
    const timeout = window.setTimeout(5000, () => {
      third.Alert("Internal error", "Unable to find user ID.")
      reject("Unable to find user ID.")
    });
    TC.Legacy.getPage("/answer", (html) => {
      html = html.substring(html.indexOf("TC.QA.Answer.init"));
      html = html.substring(html.indexOf("(") + 1);
      html = html.substring(0, html.indexOf(")"));
      window.clearTimeout(timeout);
      resolve(html);
    });
  });
}

/**
 * Gets the ID of the current user directly from the page if the current page
 * is "/answer".
 * @returns {string}
 */
third.GetUserIDFromAnswerPage = function() {
  const attr = document.querySelector("body").getAttribute("onload");
  const userID = attr.substring(18, attr.length - 1);
  return userID;
}

/**
 * Creates a popup window that can be closed.
 * @param {string} title
 * @param {string} content
 */
third.Alert = function(title, content) {
  if (typeof title !== "string" || typeof content !== "string") {
    console.error("Alert popup fields must be a string");
    return;
  }
  const bgEl = document.createElement("div");
  bgEl.style = "position:fixed;width:100%;height:100vh;top:0;left:0;background:rgba(0,0,0,0.7);";
  document.body.style = "overflow:hidden;" // should be made less brute-forcey
  const alertEl = document.createElement("div");
  alertEl.style = "position:absolute;width:30%;height:auto;top:50%;left:50%;transform:translate(-50%,-50%);background:#e0e0e0;border-radius:8px;";
  alertEl.innerHTML = `<div style="background:#444;height:auto;color:white;padding:0.5em;border-radius:8px 8px 0 0;word-wrap:break-word;">${title}</div><div style="padding:0.5em;text-align:left;">${content}</div>`;
  const closeEl = document.createElement("a");
  closeEl.href = "javascript:void(0)";
  closeEl.innerHTML = "&#10005;";
  closeEl.style = "font-weight:bold;position:absolute;display:block;top:8.5%;right:5%;color:white;";
  closeEl.addEventListener("click", () => {
    bgEl.remove();
  });
  alertEl.appendChild(closeEl)
  bgEl.appendChild(alertEl)
  document.body.append(bgEl);
}

export default third;
