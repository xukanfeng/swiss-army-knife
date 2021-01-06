{
  (function (global) {
    function jsonp(url, params, callback) {
      let queryStringArr = [];
      for (var k in params) {
        queryStringArr.push(`${k}=${params[k]}`);
      }

      let random = Math.random().toString().replace('.', '');
      let callbackFunctionName = 'jsonp_' + random;
      queryStringArr.push(`callback=${callbackFunctionName}`);

      let script = document.createElement('script');
      script.src = url + '?' + queryStringArr.join('&');
      document.body.appendChild(script);

      global[callbackFunctionName] = function (param) {
        callback(param);
        document.body.removeChild(script);
      };
    }
    global.jsonp = jsonp;
  })(window);
}