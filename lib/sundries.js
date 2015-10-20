var debug     = require('debug')('skytap-imports')
  , Q         = require('q')  
  , arghelper = require('./arghelper')
  , rest      = require('./rest')
  , vargs     = require('vargs-callback');



/** 
 * Public VM Sundries API helper:
 * http://help.skytap.com/#API_Documentation.html#Public
 * although at this time I don't see docs for sundries yet...
 *
 * @param {Skytap} reference to parent object
 */
function Sundries(skytap) {  
  this.getArgs = function getArgs() {
    return skytap.getArgs();
  };
}


/**
 * Export the module
 */
module.exports = Sundries;



/**
 * List sundries
 *
 * @callback {Function} next
 * @return {Promise}
 */
Sundries.prototype.list = vargs(function list(params, next) {
  debug('sundries %j', params);

  var args = this.getArgs();
  args.url = 'https://cloud.skytap.com/sundries';
  args.params = params;
  return rest.apiGet(args, next);
});

