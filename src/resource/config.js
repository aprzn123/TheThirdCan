fourth.config = function() {
  const cfgStr = window.sessionStorage.getItem("ttcConfigState");
  return JSON.parse(cfgStr);
}
