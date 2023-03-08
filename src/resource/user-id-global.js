fouth.UserId = function() {
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
      resolve(Number(html));
    });
  });
}

