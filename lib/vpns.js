var debug     = require('debug')('skytap-vpns')
  , Q         = require('q')  
  , arghelper = require('./arghelper')
  , rest      = require('./rest')
  , vargs     = require('vargs-callback');



/** 
 * VPNs API helper:
 * http://help.skytap.com/#API_Documentation.html#VPN
 *
 * @param {Skytap} reference to parent object
 */
function VPNs(skytap) {  
  this.getArgs = function getArgs() {
    return skytap.getArgs();
  };
}


/**
 * Export the module
 */
module.exports = VPNs;




/**
 * Gets the list of VPNs
 * 
 * @callback {Function} next
 * @return {Promise}
 */
VPNs.prototype.list = vargs(function list(params, next) {
  debug('list');

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/vpns';
  args.params = params;
  return rest.apiGet(args, next);
});


/**
 * Gets the a VPN
 * 
 * @param {Object} params
 * @config {ObjecT} vpn_id
 * @callback {Function} next
 * @return {Promise}
 */
VPNs.prototype.get = function get(params, next) {
  debug('list');

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/vpns/:vpn_id';
  args.params = params;
  return rest.apiGet(args, next);
};


/**
 * Attaches a VPN to a network in a configuration.
 * 
 * @param {Object} params
 * @config {Number} configuration_id
 * @confit {Number} network_id
 * @config {String} vpn_id
 * @callback {Function} next
 * @return {Promise}
 */
VPNs.prototype.attach = function attach(params, next) {
  debug('attach');

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/configurations/:configuration_id/networks/:network_id/vpns';
  args.params = params;
  return rest.apiPost(args, next);
};


/**
 * Detaches a VPN from a network in a configuration.
 * 
 * @param {Object} params
 * @config {Number} configuration_id
 * @confit {Number} network_id
 * @config {String} vpn_id
 * @callback {Function} next
 * @return {Promise}
 */
VPNs.prototype.detach = function detach(params, next) {
  debug('detach');

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/configurations/:configuration_id/networks/:network_id/vpns/:vpn_id';
  args.params = params;
  return rest.apiDel(args, next);
};


/**
 * Connect a VPN that is attached to a network in a configuration
 * 
 * @param {Object} params
 * @config {Number} configuration_id
 * @confit {Number} network_id
 * @config {String} vpn_id
 * @callback {Function} next
 * @return {Promise}
 */ 
VPNs.prototype.connect = function connect(params, next) {
  debug('connect');

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/configurations/:configuration_id/networks/:network_id/vpns/:vpn_id';
  args.params = params;
  args.params.connected = true;
  return rest.apiPut(args, next);
};


/**
 * Disconnect a VPN that is attached to a network in a configuration
 * 
 * @param {Object} params
 * @config {Number} configuration_id
 * @confit {Number} network_id
 * @config {String} vpn_id
 * @callback {Function} next
 * @return {Promise}
 */ 
VPNs.prototype.disconnect = function connect(params, next) {
  debug('connect');

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/configurations/:configuration_id/networks/:network_id/vpns/:vpn_id';
  args.params = params;
  args.params.connected = false;
  return rest.apiPut(args, next);
};