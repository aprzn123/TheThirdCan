function injectPronouns(third) {
  let els = document.getElementsByClassName("forum_post_user_name");
  for (let i = 0; i < els.length; i++) {
    let el = els[i];
    let user_url = el.children[0].href;
    let user_url_parts = user_url.split("/");
    let user_name = user_url_parts[user_url_parts.length - 1];
    fetch("https://novaberman.com/api/thethirdcan/pronouns/" + user_name).then(res => {
      if (res.status === 200) {
        res.text().then(text => {
          el.appendChild(document.createElement("br"));
          let pronouns_el = document.createElement("i");
          pronouns_el.innerText = text;
          pronouns_el.style.color = "#666";
          el.appendChild(pronouns_el);
        });
      }
    })
  }
}

(async() => {
  const src = browser.runtime.getURL("resource/third.js");
  const third = (await import(src)).default;

  third.InjectToggleableScripts({
    displayLatex: [
      { name: "tex-config.js", useHead: true },
      { name: "tex-mml-svg.js", useHead: true }
    ]
  }, "forum");

  const cfg = await third.GetSettings();
  if (cfg.showPronouns) {
    injectPronouns(third);
  }
})();
