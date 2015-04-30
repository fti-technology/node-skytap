var debug     = require('debug')('skytap-usage')
  , Q         = require('q')
  , arghelper = require('./arghelper')
  , rest      = require('./rest')
  , vargs     = require('vargs-callback');


/** 
 * Usage API helper:
 * http://help.skytap.com/#API_Documentation.html#Usage_Report_Resource
 *
 * THIS MODULE DOES NOT WORK WITH V2
 *
 * @param {Skytap} reference to parent object
 */
function Usage(skytap) {
  this.getArgs = function getArgs() {
    return skytap.getArgs();
  };
}


/**
 * Export the module
 */
module.exports = Usage;


/**
 * Create a report
 * 
 * @param {Date} start_date
 * @param {Date} end_date
 * @param {String} resource_type
 * @param {String} region
 * @param {String} group_by
 * @param {String} aggregate_by
 * @param {String} results_format
 * @param {Bool} utc
 * @callback {Function} next
 * @return {Promise}
 */
Usage.prototype.create = vargs(function list(params, next) {
  debug('list');

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/reports';

  params.results_format = params.results_format || 'csv'
  params.resource_type = params.resource_type || 'svms'
  params.region = params.region || 'all'
  params.group_by = params.group_by || 'user'
  params.aggregate_by = params.aggregate_by || 'month'

  args.params = params;
  return rest.apiPost(args, next);
});


/**
 * Check a report status
 *  
 * @param {Object} params
 * @config {Number} report_id
 * @callback {Function} next
 * @return {Promise}
 */
Usage.prototype.check = function get(params, next) {
  debug('get %j', params);

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/reports/:report_id';
  args.params = params;
  return rest.apiGet(args, next);
};


/**
 * Fetch a report
 *  
 * @param {Object} params
 * @config {Number} report_id
 * @config {String} extension
 * @callback {Function} next
 * @return {Promise}
 */
Usage.prototype.fetch = function get(params, next) {
  debug('get %j', params);

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/reports/'+params.report_id+'.'+params.extension;
  args.params = params;
  return rest.apiGet(args, next);
};


/**
 * Fetch a report
 *  
 * @param {Object} params
 * @config {Number} project_id
 * @config {Object} date_start
 * @config {Object} date_end
 * @callback {Function} next
 * @return {Promise}
 */
Usage.prototype.export = function get(params, next) {
  debug('get %j', params);

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/auditing/exports.json';
  args.params = params;
  return rest.apiPost(args, next);
};
