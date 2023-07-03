{
  function addStyleSheet(dir) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "/twocans_prod_2022_11_11_21_55_52/res/" + dir + ".css";
    document.head.appendChild(link);
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
    const categories = (await fourth.Request("forum.categories")).responses[0].categories;
    const usersOnline = (await fourth.Request("forum.onlinenow")).users;

    //// We need to link the appropriate stylesheets
    addStyleSheet("common_twocans");
    addStyleSheet("forum_main");

    //// Get the page at /things/ to use as a template
    const r = await fetch("https://twocansandstring.com/forum/things");
    const body = (new DOMParser()).parseFromString(await r.text(), "text/html");
    document.body.innerHTML = body.body.innerHTML;
    document.getElementById("dark_nav").innerHTML = "Forum";
    // Add search link
    document.getElementById("content_host").innerHTML = '<div id="forum_main_options"></div><table id="forum_main_categories" border="0" cellspacing="0" cellpadding="5"><thead><tr style="font-weight:bold;"><td></td><td></td><td>Threads</td><td>Posts</td></tr></thead></table>'
    const a = document.getElementById("forum_main_options");
    a.innerHTML = '<a href="https://twocansandstring.com/forum/search">Search Posts</a> | <a href="https://twocansandstring.com/forum/readall">Mark all posts as read</a>';

    //// Now start reconstructing our categories from scratch
    const tbody = document.createElement("tbody");
    for (let category of categories) {
      const unreadIndicator = category.newThreads ? `<span style="font-weight:bold;color:#53a46e;font-size:10pt;">${category.newThreads} New</span>` : ""
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>
<div class="forum_main_catname"><a href="/forum/${category.id}">${category.name}</a></div>
<div class="forum_main_catdesc">${category.description}</div>
</td>
<td>${unreadIndicator}</td>
<td class="forum_main_thread_count">${category.threads}</td>
<td class="forum_main_post_count">${category.posts}</td>`
      tbody.appendChild(tr);
    }
    document.getElementById("forum_main_categories").appendChild(tbody);

    //// Finally, construct the "users online" footer
    const usersOnlineDiv = document.createElement("div");
    usersOnlineDiv.id = "forum_main_usersonline";
    usersOnlineDiv.innerHTML = "Users on the forum:"
    for (let userId in usersOnline) {
      const user = usersOnline[userId];
      usersOnlineDiv.innerHTML += ` <img class="users_online_avatar" src="${user.avatar}"> <a href="/users/${user.key}">${user.name}</a>`;
      if (userId < usersOnline.length - 1) usersOnlineDiv.innerHTML += ",";
    }
    document.getElementById("content_host").appendChild(usersOnlineDiv);
  })();
}