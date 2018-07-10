module.exports = report;

function report(info) {
    const {userAgent, pageUrl, timestamp, type, error} = info;
    const img = new Image(1, 1);
    const params = `user_agent=${userAgent}&page_url=${pageUrl}&error_time=${timestamp}&error_type=${type}&error=${JSON.stringify(error)}`;
    img.src = `http://xxxxxxx?${params}&_dc=${Math.random()}`;
}
function debounce(fn, delay) {
    var timer
    return function () {
      var context = this
      var args = arguments
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }