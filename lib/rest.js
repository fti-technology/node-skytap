var debug     = require('debug')('skytap-rest')
  , request   = require('request')
  , Q         = require('q')
  , arghelper = require('./arghelper');

var headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

exports.apiGet = function(args, next) {
  args.method = 'GET';
  return apiRequest(args, next);
};

exports.apiPost = function(args, next) {
  args.method = 'POST';
  return apiRequest(args, next);
};

exports.apiPut = function(args, next) {
  args.method = 'PUT';
  return apiRequest(args, next);
};

exports.apiDel = function(args, next) {
  args.method = 'DELETE';
  return apiRequest(args, next);
};


/**
 * Performs the api request based on the supplied arguments
 *
 * @param {Object} args
 * @config {String} url - required
 * @config {String} method - required
 * @config {Object} auth - required
 * @config {String} auth.user - required
 * @config {String} auth.pass - required
 * @config {Object} body
 *
 * @callback next
 * @return {Promise}
 * @api private
 */
function apiRequest(args, next) {
  var deferred = Q.defer()    
    , opts;

  if (args._v2) {
    headers.Accept = 'application/vnd.skytap.api.v2+json';
  } else {
    headers.Accept = 'application/json';
  }

  opts = {
    json: true,
    headers: headers,    
  };

  opts = arghelper.combine(opts, args);
  opts = arghelper.convertAuth(opts);
  opts = arghelper.convertUrlParams(opts);
  opts = arghelper.convertReqParams(opts);

  debug('apiRequest: %j', opts);

  // check for valid required arguments
  if(!(opts.url && opts.method && opts.auth && opts.auth.user && opts.auth.pass)) {
    var error = new Error('url, method, auth.user, and auth.pass are required arguments');
    
    deferred.reject(error);
    if(next) return next(err);
  }

  // make the request
  request(opts, function(err, res, data) {

    // handle exception
    if(err) {
      deferred.reject(err);
      if(next) next(err);
    } 

    // handle non-200 response 
    else if (res.statusCode !== 200) {
      deferred.reject(data);
      if(next) next(data);
    } 

    // handle success
    else {
      deferred.resolve(data);
      if(next) next(null, data);
    }
      
  });

  return deferred.promise;
}
