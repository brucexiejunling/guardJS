function isIE() {
  return 'activexobject' in window;
}
function isFunc(fun) {
  return typeof fun === 'function';
}
module.exports = {
    isIE,
    isFunc
}
