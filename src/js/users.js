function injectPronouns() {
  const username = window.location.pathname.slice(7);
  const ea = document.querySelector("#content_host > div > h1");
  const e = document.createElement("div");
  e.style.color = "#888";
  e.style.fontStyle = "italic";
  fetch("https://novaberman.com/api/thethirdcan/pronouns/" + username).then(r => {
    if (r.status === 200) {
      r.text().then(t => {
        e.textContent = t;
        ea.after(e);
      });
    }
  }).catch(r => {
    console.warn("couldn't get pronouns for " + username + "\n\n" + r);
  });
}

(async() => {
  const src = browser.runtime.getURL("resource/third.js");
  const third = (await import(src)).default;

  third.InjectToggleableScripts({
    stealAvatar: "stealAvatarButton.js",
  }, "users");

  const cfg = await third.GetSettings();
  if (cfg.showPronouns) {
    injectPronouns();
  }
})();
