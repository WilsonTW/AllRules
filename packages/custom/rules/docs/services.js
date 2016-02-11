'use strict';

exports.load = function(swagger, parms) {

  var searchParms = parms.searchableOptions;

  var list = {
    'spec': {
      description: 'Rule operations',
      path: '/rules',
      method: 'GET',
      summary: 'Get all Rules',
      notes: '',
      type: 'Rule',
      nickname: 'getRules',
      produces: ['application/json'],
      params: searchParms
    }
  };

  var create = {
    'spec': {
      description: 'Device operations',
      path: '/articles',
      method: 'POST',
      summary: 'Create article',
      notes: '',
      type: 'Article',
      nickname: 'createArticle',
      produces: ['application/json'],
      parameters: [{
        name: 'body',
        description: 'Article to create.  User will be inferred by the authenticated user.',
        required: true,
        type: 'Article',
        paramType: 'body',
        allowMultiple: false
      }]
    }
  };

  swagger.addGet(list)
    .addPost(create);

};
