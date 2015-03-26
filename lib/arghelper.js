var debug = require('debug')('skytap-helpers')
  , url   = require('url')
  , qs    = require('querystring')
  , _     = require('underscore');


/**
 * Copy all of the properties in the source object
 * over to the destination object, and return a 
 * new object. The source will overwrite properties 
 * on the destination. This will also exclude
 * undefined and null value properties on the source.
 * 
 * @param {Object} destination
 * @param {Object} source
 * @result {Object}
 */
exports.combine = function combine(dst, src) {  
  var cleanSrc, cleanDst;

  cleanDst = _.clone(dst);
  cleanSrc = _.pick(src, function(value, key, object) {
    return value !== undefined && value !== null;
  });

  return _.extend(cleanDst, cleanSrc);
};


/**
 * Constructs the auth values used by the REST API
 * by cloning the options and converting username, pasword, and
 * token values into an auth object. It will not overwrite existing
 * auth object values.
 *
 * @param {Object} opts
 * @config {String} username
 * @config {String} password
 * @config {String} token
 * @result {Object}
 */
exports.convertAuth = function convertAuth(opts) {  
  var results = _.clone(opts)
    , user = results.username
    , pass = results.password
    , token = results.token
    , auth = results.auth;

  // construct auth if it doesn't exist
  if(!results.auth) {
    results.auth = { };
  }
    
  // set the values
  results.auth.user = results.auth.user || user;
  results.auth.pass = results.auth.pass || token || pass;

  // remove properties
  delete results.username;
  delete results.password;
  delete results.token;

  return results;
};


/** 
 * Converts params into the correct REST request parameters
 * for GET or POST/PUT/DELETE requests. GET request values
 * are appended to the URL as query string values. POST/PUT/DELETE
 * params are converted into the body parameter. The origin object
 * is retained and a new object is constructed.
 *
 * @param {Object} opts
 * @config {String} method
 * @config {Object} params
 * @result {Object}
 */
exports.convertReqParams = function convertReqParams(opts) {
    var result = opts
      , method = result.method
      , params = result.params
      , queryString;

  if(params) {

    // clone the result since we're going to mutate it
    result = _.clone(opts);

    // handle GET requests by appending to the query string
    if(method === 'GET') {
      queryString = qs.stringify(params);
      if (queryString.length) {
        if(result.url.indexOf('?') === -1) {
          result.url = result.url + '?' + queryString;
        }
        else {
          result.url = result.url + '&' + queryString;
        }
      }
    }

    // handle POST/PUT/DELETE
    else { 

      // only set body if there are values
      if(_.keys(params).length > 0) {    
        result.body = params;
      }
      
    }
  }


  // remove the param property
  delete result.params;

  return result;
};


/**
 * Converts params values into the url params
 * For example /:id would map to the param id
 * and returns a copied version of the original 
 * options input parameter
 *
 * @param {Object} opts
 * @config {Object} params
 * @config {String} url
 * @return {Object}
 */
exports.convertUrlParams = function(opts) {
  var result      = _.clone(opts)
    , urlParts    = url.parse(result.url)
    , pathParts   = urlParts.pathname.split('/')
    , processed;

  // short circuit if no params
  if(result.params) {
    
    // clone params so we don't mutate original params obj
    result.params = _.clone(result.params);

    // replace all parts with their value  
    processed = pathParts.map(function(part) {
      var paramName
        , paramValue;
      
      // check if this is a param
      if(part.indexOf(':') === 0) {

        // get the actual name of the param
        paramName = part.substring(1);

        // get the value for the param or default to the name
        paramValue = result.params[paramName];

        // delete from params object
        delete result.params[paramName];
      }

      return paramValue || part;
    });

    // convert the processed parts into the new url  
    urlParts.pathname = processed.join('/');
    result.url = url.format(urlParts);
  }
  
  return result;
};
