'use strict';

// Grup authorization helpers
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

module.exports = function(Groups, app, auth) {
  
  var groups = require('../controllers/groups')(Groups);
 
  app.route('/api/groups')
    .get(groups.all)
    .post(auth.requiresLogin, hasPermissions, groups.create);
  app.route('/api/groups/:groupId')
    .get(auth.isMongoId, groups.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, hasPermissions, groups.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, hasPermissions, groups.destroy);
 
  // Finish with setting up the ruleId param
 app.param('groupId', groups.group);
};



// The Package is past automatically as first parameter

/*

module.exports = function(Groups, app, auth, database) {

  app.get('/api/groups/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/api/groups/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/api/groups/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/api/groups/example/render', function(req, res, next) {
    Groups.render('index', {
      package: 'groups'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};


*/