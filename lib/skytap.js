var debug         = require('debug')('skytap')
  , _             = require('underscore')
  , arghelper     = require('./arghelper')
  , rest          = require('./rest')
  , Audit         = require('./audit')
  , Environments  = require('./environments')
  , Imports       = require('./imports')
  , Ips           = require('./ips')
  , Networks      = require('./networks')
  , Projects      = require('./projects')
  , Sundries      = require('./sundries')
  , Templates     = require('./templates')
  , Usage         = require('./usage')
  , Users         = require('./users')
  , Vms           = require('./vms')
  , Vpns          = require('./vpns');


/**
 * Skytap API Library
 *
 * @param {Object} config 
 */
function Skytap () {    
  this.audit        = new Audit(this);
  this.environments = new Environments(this);
  this.ips          = new Ips(this);
  this.imports      = new Imports(this);
  this.networks     = new Networks(this);
  this.projects     = new Projects(this);
  this.sundries     = new Sundries(this);
  this.templates    = new Templates(this);
  this.usage        = new Usage(this);
  this.users        = new Users(this);
  this.vms          = new Vms(this);
  this.vpns         = new Vpns(this);

  this.getArgs = function getArgs() {
    return _.clone(this._config);
  };
}


/** 
 * Export the module
 */
module.exports = Skytap;



/**
 * Initializes the Skytap API with the default configuration
 * 
 * @param {Object} config
 * @config {String} username
 * @config {String} password
 * @config {String} token
 * @config {String} proxy
 */
Skytap.init = function init(config) {
  var instance = new Skytap();
  instance._config = config;
  return instance;
};


/**
 * Retrieves the Skytap API token based on the user credentials 
 *
 * @param {Object} args
 * @config {Object} username
 * @config {Object} password 
 * @callback {Function} next
 * @return {Promise}
 */
Skytap.token = function(args, next) {
  debug('token');
  
  args.url = 'https://cloud.skytap.com/account/api_token';  
  return rest.apiGet(args, next);
};
