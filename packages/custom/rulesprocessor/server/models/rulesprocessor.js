'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RulesProcessorSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  sourceip: {
    type: String,
    required: false,
    default:'',
    trim: true
  },
  event: {
    type: String,
    default: '',
    required: false,
    trim: true
  },
  reqbody: {
    type: String,
    default: '',
    required: false,
    trim: true
  },
  response: {
    type: String,
    default: '',
    required: false,
    trim: true
  },
  httpstatus: {
    type: String,
    default: '',
    required: false,
    trim: true
  }
});


mongoose.model('RulesProcessor', RulesProcessorSchema);
