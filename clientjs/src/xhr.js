// --- DOCS DONE
/**
 * Provides an XMLHTTPRequest utility.
 * @namespace
 * @class DGE
 */

/**
 * Sends an XHR request.
 * @param {String} method The method to use (GET, POST)
 * @param {String} url The URI/URL to hit.
 * @param {Object} callbacks The methods to call (complete, error, success).
 * @param {Object} data The key/value pair of variables to set (only when method=POST).
 * @return {Object} DGE (for chaining).
 * @method xhr
 */
DGE.xhr = function(method, url, callbacks, data) {

  var i, post, req;

	callbacks = (callbacks || {});

  // Find out what kind of XHR object we need
  try {
    req = new XMLHttpRequest();
  } catch(e) {

    var types = [
      'MXSML2.XMLHTTP3.0',
      'MXSML2.XMLHTTP',
      'Microsoft.XMLHTTP'
    ];

    for (i = 0; i < types.length; i++) {
      try {
        req = new ActiveXObject(types[i]);
        break;
      } catch(e) {}
    }

  }

  req.open(method, url, true);

  // Parse the data object
  if (method.toUpperCase() == 'POST') {

    post = '';

    for (i in data) {

      // For arrays, we need to iterate through each member
      if ((typeof(data[i]) == 'object') && data[i].length) {

        for (var a = 0; a < data[i].length; a++) {
          post += printf('%[]=%&', i, encodeURIComponent(data[i][a]));
        }

      } else {
        post += printf('%=%&', i, encodeURIComponent(data[i]));
      }

    }

    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  } else {
    req.setRequestHeader('Content-Type', 'application/x-javascript');
  }

  req.onreadystatechange = function() {
    if (req.readyState == 4) {

      if (callbacks.complete) callbacks.complete(req);

      if (req.status == 200) {
        if (callbacks.success) callbacks.success(req);
      } else if (req.status == 404) {
        if (callbacks.error) callbacks.error(req);
      }

    }
  };

  req.send(post || null);

	return DGE;

};
