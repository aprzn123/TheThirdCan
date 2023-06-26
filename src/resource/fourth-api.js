////////////////////////////////////////
// Fourth TCaS API-related functions. //
////////////////////////////////////////

/**
 * Send a request to the Two Cans and String stitchservices API.
 * @param {string} fn The name of the function. Follows the format of [category].[function]. The API is undocumented, so if there is a function name you are looking for that you don't know the name of, then you are mostly out of luck.
 * @example fourth.Request("forum.categories");
 */
fourth.Request = function(fn) {
  if (typeof fn === "string") fn = [fn];
  let fns = [];
  for (let f of fn) {
    fns.push({"fn": f});
  }
  return new Promise((resolve, reject) => {
    fetch("https://twocansandstring.com/stitchservices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "apiVersion": null,
        "expectUserChange": true,
        "requests": fns
      })
    }).then(v => {
      v.json().then(resolve);
    }, reject);
  });
}

/**
 * This function gets the authentication token of the currently logged in user.
 * This can be used to perform *just about any request* on their behalf.
 * Use with caution and only when absolutely necessary.
 * @returns {string}
 */
fourth.GetUserToken = function() {
  // Generally the only cookie being stored is our auth token. This makes things a bit easier.
  const c = (`; ${document.cookie}`).split("; twocansandstring_com_auth2=");
  if (c.length !== 2) {
    console.warn("The user is not logged in or some sort of error has occurred while fetching twocansandstring_com_auth2. Any functions relying on their authentication token will either not work or have impaired functionality.");
    return "";
  }
  return c.pop().split(";").shift();
  // Solution sourced from Stack Overflow https://stackoverflow.com/a/15724300
}
