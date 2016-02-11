'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Rule = mongoose.model('Rule'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Rules) {

    return {
        /**
         * Find rule by id
         */
        rule: function(req, res, next, id) {
            Rule.load(id, function(err, rule) {
                if (err) return next(err);
                if (!rule) return next(new Error('Failed to load rule ' + id));
                req.rule = rule;
                next();
            });
        },
        /**
         * Create a rule
         */
        create: function(req, res) {
            var rule = new Rule(req.body);
            rule.user = req.user;

            rule.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the rule'
                    });
                }

                Rules.events.publish({
                    action: 'created',
                    user: {
                        name: req.user.name
                    },
                    url: config.hostname + '/rules/' + rule._id,
                    name: rule.title
                });

                res.json(rule);
            });
        },
        /**
         * Update a rule
         */
        update: function(req, res) {
            var rule = req.rule;

            rule = _.extend(rule, req.body);


            rule.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the rule'
                    });
                }

                Rules.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: rule.title,
                    url: config.hostname + '/rules/' + rule._id
                });

                res.json(rule);
            });
        },
        /**
         * Delete a rule
         */
        destroy: function(req, res) {
            var rule = req.rule;


            rule.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the rule'
                    });
                }

                Rules.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: rule.title
                });

                res.json(rule);
            });
        },
        /**
         * Show a rule
         */
        show: function(req, res) {

            Rules.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.rule.title,
                url: config.hostname + '/rules/' + req.rule._id
            });

            res.json(req.rule);
        },
        /**
         * List of Rules
         */
        all: function(req, res) {
            var query = req.acl.query('Rule');

            query.find({}).sort('-created')
                .populate('user', 'name username')
                .populate('group', 'name groupname')
                .exec(function(err, rules) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the rules'
                    });
                }

                res.json(rules)
            });

        }
    };
}