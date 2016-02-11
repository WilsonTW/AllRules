'use strict';

// Rule authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && !req.rule.user._id.equals(req.user._id)) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

var hasPermissions = function(req, res, next) {

    req.body.permissions = req.body.permissions || ['authenticated'];

    for (var i = 0; i < req.body.permissions.length; i++) {
      var permission = req.body.permissions[i];
      if (req.acl.user.allowed.indexOf(permission) === -1) {
            return res.status(401).send('User not allowed to assign ' + permission + ' permission.');
        }
    }

    next();
};

module.exports = function(Rules, app, auth) {
  
  var rules = require('../controllers/rules')(Rules);

  app.route('/api/rules')
    .get(rules.all)
    .post(auth.requiresLogin, hasPermissions, rules.create);
  app.route('/api/rules/:ruleId')
    .get(auth.isMongoId, rules.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, hasPermissions, rules.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, hasPermissions, rules.destroy);
  // Finish with setting up the ruleId param
  app.param('ruleId', rules.rule);
};

