const third = {};

third.GetEnums = async function() {
  return (await import(browser.runtime.getURL("resource/enums.js"))).default;
}

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
 * Injects the `fourth` object into the page
 */
third.InjectFourth = async function(caller) {
  // send config to page
  const settings = await third.GetSettings();
  window.sessionStorage.setItem("ttcConfigState", JSON.stringify(settings));
  // so that the page knows where to get enums from
  window.sessionStorage.setItem("ttcEnums", browser.runtime.getURL("resource/enums.js"));

  // easier to inject functions this way
  const _inject = function(name, isModule) {
    const decl = document.createElement("script");
    if (isModule) {decl.type = "module";}
    decl.src = browser.runtime.getURL(`resource/${name}`);
    document.head.appendChild(decl);
  }

  // give fourth some functions
  _inject("enums.js", true);
  _inject("fourth-decl.js", false);
  _inject(caller === "answer" ? "user-id-answer.js" : "user-id-global.js", false);
  _inject("config.js", false);
  _inject("fourth-enums.js", false);
  _inject("fourth-api.js", false);
  _inject("fourth-util.js", false);
}

/**
 * Inserts a script tag in the page that links to an extension script.
 * If you are calling this function, make sure fourth is injected first with `await third.InjectFourth();`.
 * @param {string} path The path to the script file to be injected. Should be in the `/injected` directory.
 * @param {object} options Additional options.
 * @returns {HTMLScriptElement}
 */
third.InjectScript = async function(path, options) {
  // note that options shouldn't have a "name" property, to keep the code for third.InjectToggleableScripts simpler.
  options = options || {}
  const el = document.createElement("script");
  el.src = third.GetPath(path);
  el.type = "text/javascript";
  el.async = options.noAsync ? false : true;
  el.defer = !!options.defer;
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
  // Early return to reduce load when there are no scripts
  if (scriptsToInject.length == 0) { return; }

  await third.InjectFourth(caller);

  // inject scripts
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
          console.error(`${trueScript} is not a valid script name`);
        }
      }
    } else if (typeof script === "object") {
      third.InjectScript(script.name, script);
    } else {
      console.error(`${script} is not a valid script name`);
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

export default third;
