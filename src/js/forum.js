function injectPronouns() {
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

function configureLatex() {
  let tag = document.createElement("script");
  tag.src = browser.runtime.getURL("injected/tex-config.js");
  document.getElementsByTagName("head")[0].appendChild(tag);
}

function injectLatex() {
  let tag = document.createElement("script");
  tag.async = true;
  tag.type = "text/javascript";
  tag.src = browser.runtime.getURL("injected/tex-mml-svg.js");
  document.getElementsByTagName("head")[0].appendChild(tag);
}

let results = fetch(browser.runtime.getURL("injected/default_settings.json"))
    .then((response) => response.json())
    .then((settings) => browser.storage.sync.get(settings));
results.then((cfg) => {
  if (cfg.showPronouns) {
    injectPronouns();
  }
  if (cfg.displayLatex) {
    configureLatex();
    injectLatex();
  }
});
