{
  (async () => {
    const b = document.createElement("button");
    b.textContent = "Paste users";
    b.style.background = "linear-gradient(#7323c4, #5023cc)";
    b.type = "button";
    b.onclick = async () => {
      let str = "Users online:";
      const users = (await fourth.Request("forum.onlinenow")).users;
      for (let id in users) {
        const user = users[id];
        str += ` <b><link url="https://twocansandstring.com/users/${user.key}">${user.name}</link></b>`;
        if (id < users.length - 1 && users.length > 2) str += ",";
        if (id == users.length - 2) str += " and"; //...why? why does === not work and only == does? what the fuck?
      }
      document.getElementById("post_textbox").textContent += str;
    }
    document.querySelector("form > div[style]").prepend(b);
  })()
}