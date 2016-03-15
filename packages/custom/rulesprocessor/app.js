'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Rulesprocessor = new Module('rulesprocessor');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Rulesprocessor.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Rulesprocessor.routes(app, auth, database);



  //We are adding a link to the main menu for all authenticated users
  Rulesprocessor.menus.add({
    title: 'Processing Log',
    link: 'rulesprocessor list',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Rulesprocessor.aggregateAsset('css', 'rulesprocessor.css');
  Rulesprocessor.aggregateAsset('js', '../lib/angular-google-chart/ng-google-chart.min.js', {
        absolute: false,
        global: true
    });
  Rulesprocessor.angularDependencies(['angular-google-chart']);

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Rulesprocessor.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Rulesprocessor.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Rulesprocessor.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Rulesprocessor;
});
