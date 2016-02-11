'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Rules = new Module('rules');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Rules.register(function(app, auth, database,circles,swagger) {

  //We enable routing. By default the Package Object is passed to the routes
  Rules.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Rules.menus.add({
    title: 'Rules',
    link: 'all rules',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Rules.aggregateAsset('css', 'rules.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Rules.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Rules.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Rules.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Rules;
});
