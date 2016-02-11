exports.models = {

  Rule: {
    id: 'Rule',
    required: ['name'],
    properties: {
   
      name: {
        type: 'string',
        description: 'Rule name'
      },
      execWhenKey: {
        type: 'string',
        description: 'Indicates the rule should be executed when the specified key is sent with the document'
      },
      execIf: {
          type: 'string',
          description: 'Indicates the rules to execute'
      },
      execthen: {
          type: 'string',
          description: 'Describes the steps to execute if the rules evaluate positively'
      },
      enabled: {
          type: 'Boolean',
          description: 'Describes if the rule is enabled (will be executed) or not'
      },
      group: {
          type: 'ObjectId',
          description: 'Describes the group this rule is associated to'
      }
    }
  }  
};
