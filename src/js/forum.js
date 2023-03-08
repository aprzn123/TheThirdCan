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

function configureLatex(third) {
  third.InjectScript("tex-config.js", { useHead: true })
}

function injectLatex(third) {
  third.InjectScript("tex-mml-svg.js", { useHead: true })
}

(async() => {
  const src = browser.runtime.getURL("resource/third.js");
  const third = (await import(src)).default;
  if (document.querySelector("script#THIRD_IMPORT") == null) {
    const thirdImport = document.createElement("script");
    thirdImport.id = "THIRD_IMPORT";
    thirdImport.src = src;
    thirdImport.type = "module";
    document.body.appendChild(thirdImport)
  }
let results = third.GetSettings()
    .then((response) => response.json())
    .then((settings) => browser.storage.sync.get(settings));
results.then((cfg) => {
  if (cfg.showPronouns) {
    injectPronouns(third);
  }
  if (cfg.displayLatex) {
    configureLatex(third);
    injectLatex(third);
  }
})})();
