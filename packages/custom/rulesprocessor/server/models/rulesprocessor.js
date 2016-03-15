'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var cfg;

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

// keeplasttype: 'M'=month,'D'=days, 'E'=entries
var RulesProcessorConfigSchema = new Schema({
  keeplasttype: {
    type: String,
    default: 'E'
  },
  keeplast: {
    type: Number,
    default:1500
  },
});

mongoose.model('RulesProcessorConfig',RulesProcessorConfigSchema);

mongoose.model('RulesProcessor', RulesProcessorSchema);

cfg = mongoose.model('RulesProcessorConfig'); 
cfg.count({},function(err,count) {
    if (err) { 
        console.log('cannot read cfg');
        return;
    }
    if (count === 0) {
        var cfgn = new cfg({ "keeplasttype": "E", "keeplast":50 });
        cfgn.save(function (err) {
        if (err) { 
            console.log('could not save cfg');
        }
    });
    }
});