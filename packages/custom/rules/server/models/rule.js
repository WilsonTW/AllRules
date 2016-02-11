'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Rule Schema
 */
var RuleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  execWhenKey: {
    type: String,
    default: '',
    required: true,
    trim: true
  },
  execIf: {
    type: String,
    default: '',
    required: true,
    trim: true
  },
  execThen: {
    type: String,
    default: '',
    required: true,
    trim: true
  },
  execElse: {
    type: String,
    default: '',
    required: false,
    trim: true
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  group: {
    type: Schema.ObjectId,
    ref: 'Group',
    required: false
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  validFrom: {
    type: Date
  },
  validTo: {
    type: Date
  },
  execOrder: {
    type: Number,
    default:0,
    required: true
  },
  permissions: {
    type: Array
  },
  updated: {
    type: Array
  }
});

/**
 * Validations
 */
RuleSchema.path('name').validate(function(name) {
            return !!name;
        }, 'Name cannot be blank');
        
RuleSchema.path('validFrom').validate(function(validFrom) {
            return !!validFrom;
        }, 'Valid From date cannot be blank');
RuleSchema.path('validTo').validate(function(validTo) {
            return !!validTo;
        }, 'Valid To date cannot be blank');


/**
 * Statics
 */
RuleSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  })
  .populate('user', 'name username')
  .populate('group', 'name groupname')
  .exec(cb);
};
/*
RuleSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('group', 'name groupname').exec(cb);
};
*/
mongoose.model('Rule', RuleSchema);
