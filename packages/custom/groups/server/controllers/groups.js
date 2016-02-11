'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Groups) {

    return {

        group: function(req, res, next, id) {
            Group.load(id, function(err, group) {
                if (err) return next(err);
                if (!group) return next(new Error('Failed to load group ' + id));
                req.group = group;
                next();
            });
        },

        create: function(req, res) {
            var group = new Group(req.body);
            group.user = req.user;

            group.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the group'
                    });
                }

                Groups.events.publish({
                    action: 'created',
                    user: {
                        name: req.user.name
                    },
                    url: config.hostname + '/groups/' + group._id,
                    name: group.title
                });

                res.json(group);
            });
        },
        /**
         * Update a group
         */
        update: function(req, res) {
            var group = req.group;

            group = _.extend(group, req.body);


            group.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the group'
                    });
                }

                Groups.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: group.name,
                    url: config.hostname + '/groups/' + group._id
                });

                res.json(group);
            });
        },
        /**
         * Delete a group
         */
        destroy: function(req, res) {
            var group = req.group;


            group.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the group'
                    });
                }

                Groups.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: group.name
                });

                res.json(group);
            });
        },
        /**
         * Show a group
         */
        show: function(req, res) {

            Groups.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.group.name,
                url: config.hostname + '/groups/' + req.group._id
            });

            res.json(req.group);
        },
        /**
         * List of Groups
         */
        all: function(req, res) {
            //var query = req.acl.query('Group');

            Group.find({}).exec(function(err, groups) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the Groups'
                    });
                }

                res.json(groups)
            });

        }
    };
}