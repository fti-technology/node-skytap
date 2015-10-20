var debug     = require('debug')('skytap-imports')
  , Q         = require('q')  
  , arghelper = require('./arghelper')
  , rest      = require('./rest')
  , vargs     = require('vargs-callback');



/** 
 * Public VM Import API helper:
 * http://help.skytap.com/#API_Documentation.html#Public
 *
 * @param {Skytap} reference to parent object
 */
function Imports(skytap) {  
  this.getArgs = function getArgs() {
    return skytap.getArgs();
  };
}


/**
 * Export the module
 */
module.exports = Imports;



/**
 * List imports
 *
 * @callback {Function} next
 * @return {Promise}
 */
Imports.prototype.list = vargs(function list(params, next) {
  debug('imports %j', params);

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/imports';
  args.params = params;
  return rest.apiGet(args, next);
});

/**
 *
 * Creates a new Import job
 * @param {Object} params
 * @config {String} params.template_name - required
 * @config {String} params.region
 * @config {String} params.md5
 * @callback {Function} next
 * @return {Promise}
 */

Imports.prototype.create = function create(params, next) {
  debug('import %j', params);

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/imports'
  args.params = params;
  return rest.apiPost(args, next);
};

/**
 *
 * Start an existing import job
 *
 * @param {Object} params
 * @config {Number} import_id
 * @callback {Function} next
 * @return {Promise}
 */

 Imports.prototype.start = function start(params, next) {
  debug('start %j', params);

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/imports/:import_id'
  params.status = "processing"; // really?
  args.params = params;
  return rest.apiPut(args, next);
 };

 /**
  *
  * Import status for existing job
  *
  * @param {Object} params
  * @config {Number} import_id
  * @callback {Function} next
  * @return {Promise}
  */

  Imports.prototype.status = function status(params, next) {
    debug('status %j', params);

    var args = this.getArgs();
    args.url = 'https://cloud.skytap.com/imports/:import_id'
    args.params = params;
    return rest.apiGet(args, next);
  };

  /**
   * Delete import job and depot
   *
   * @param {Object} params
   * @config {Number} import_id
   * @callback {Function} next
   * @return {Promise}
   */
  Imports.prototype.del = function del(params, next) {
    debug('delete %j', params);

    var args = this.getArgs();
    args.url = 'https://cloud.skytap.com/imports/:import_id'
    args.params = params
    return rest.apiDel(args, next);
  }