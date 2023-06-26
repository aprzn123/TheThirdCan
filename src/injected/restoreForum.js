{
  function addStyleSheet(dir) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "/twocans_prod_2022_11_11_21_55_52/res/" + dir + ".css";
    document.head.appendChild(link);
  }
  function getCategories() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://twocansandstring.com/stitchservices");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText).responses[0].categories);
        else reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.onerror = () => {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      }
      xhr.send(JSON.stringify({
        "apiVersion": null,
        "expectUserChange": true,
        "requests": [{"fn": "forum.categories"}]
      }));
    })
  }
  /** @returns {HTMLElement} */
  const getElementByClass = classname => document.querySelector("." + classname);
  const delay = ms => new Promise((resolve) => {
      setTimeout(resolve, ms);
  });

  (async () => {
    //// We need to set a delay after the window loads because TCaS's JavaScript overwrites page content before
    //// we can fully modify it.
    await delay(10); // This should be enough. Hopefully.
    document.title = "Two Cans and String : Forum";
    const categories = await getCategories();
    //// We need to link the appropriate stylesheets
    addStyleSheet("common_twocans")
    addStyleSheet("forum_category");
    //// Get the page at /things/ to use as a template
    const r = await fetch("https://twocansandstring.com/forum/things");
    const body = (new DOMParser()).parseFromString(await r.text(), "text/html");
    document.body.innerHTML = body.body.innerHTML;
    document.getElementById("dark_nav").innerHTML = "Forum";
    // Add search link
    const a = document.createElement("div");
    a.innerHTML = '<a href="https://twocansandstring.com/forum/search">Search Posts</a> | <a href="javascript:void(0)">Mark all posts as read</a>';
    a.style.textAlign = "right";
    document.getElementById("content_host").prepend(a);
    //// Now start reconstructing our categories from scratch
    getElementByClass("forum_threads_table").innerHTML = '<div class="forum_threads_header" style="background:#0000;color:#000;"><div class="titlecol">&nbsp;</div><div class="viewscol">&nbsp;</div><div class="viewscol">Threads</div><div class="repliescol">Posts</div>';
    for (let category of categories) {
      const unreadIndicator = category.newThreads ? `<span style="font-weight:bold;color:#53a46e;font-size:10pt;">${category.newThreads} New</span>` : ""
      const div = document.createElement("div");
      div.className = "forum_threads_thread";
      div.innerHTML = `<div class="titlecol">
<div class="thread_title"><a href="/forum/${category.id}" style="font-weight:bold;">${category.name}</a></div>
<div class="thread_preview_text">${category.description}</div>
</div>
<div class="viewscol">${unreadIndicator}</div>
<div class="viewscol">${category.threads}</div>
<div class="repliescol">${category.posts}</div>`
      getElementByClass("forum_threads_table").appendChild(div);
    }
  })();
}