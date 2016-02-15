'use strict';



/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(rulesprocessor, app, auth, database) {

    
    app.get('/api/rulesprocessor/logs/entries/:page', function(req, res, next) {
        var rulesprocessor = require ('../controllers/rulesprocessor');
        rulesprocessor.getlogentries(req,res);
  });

    app.get('/api/rulesprocessor/logs/clearentries', function(req, res, next) {
        var rulesprocessor = require ('../controllers/rulesprocessor');
        rulesprocessor.clearentries(req,res);
  });
  
    app.put('/api/rulesprocessor/:eventId', function(req, res, next) {
        var rulesprocessor = require ('../controllers/rulesprocessor');
        rulesprocessor.processevent(req,res);
  });


};
