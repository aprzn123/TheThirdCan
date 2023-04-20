/*
 * users.js
 * Copyright (C) 2023 sandvich <sandvich@artix>
 *
 * Distributed under terms of the MIT license.
 */

function injectStealAvatarButton() {
  // this requires DOM injection because canvas elements can not access images from another domain
  let tag = document.createElement("script");
  tag.src = browser.runtime.getURL("injected/stealAvatarButton.js");
  document.getElementsByTagName("head")[0].appendChild(tag);
}

console.log("injected users.js");
let results = fetch(browser.runtime.getURL("injected/default_settings.json"))
    .then((response) => response.json())
    .then((settings) => browser.storage.sync.get(settings));
results.then((cfg) => {
  if (cfg.stealAvatarButton) {
    injectStealAvatarButton();
  }
});
