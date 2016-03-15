'use strict'

var mongoose = require('mongoose'),
    RulesProcessor = mongoose.model('RulesProcessor'),
    RulesProcessorConfig = mongoose.model('RulesProcessorConfig');

exports.getmsgcounts = function(req,res) {
   var i=0;
   var resdata ={};
   resdata=   {
        "type": "LineChart",
        "options": {
            "title": "Events last 30 days",
            "displayExactValues": true,
            "vAxis": {
                "title": "Events Qty"
            },
            "hAxis": {
                "title": "Date"
            }
        },
        "formatters": {}
    };
   resdata.data={};
   resdata.data.cols = [
        {id: "day", label: "Day", type: "date"},
        {id: "events", label: "Events", type: "number"}
    ];
    
    RulesProcessor
        .aggregate([
            { $match: {timestamp : {$gt : new Date(Date.now() - 30*24*60*60 * 1000)}} },
            { $group: {_id : { year: { $year : "$timestamp" }, month: { $month : "$timestamp" },day: { $dayOfMonth : "$timestamp" }}, count : { $sum : 1 }}},
            { $sort : { "_id.year" : 1, "_id.month" : 1, "_id.day" : 1,} }
        ], function(err, data) {
                if (err) {
                console.log('Cannot aggregate logs');
                return res.status(500);
            } else {
                resdata.data.rows = [];
                for (i=0;i<data.length;i++){
                    resdata.data.rows.push(
                            {"c":
                                [
                                    {"v":"Date(" + data[i]._id.year + "," + data[i]._id.month + "," + data[i]._id.day +")"},
                                    {"v":data[i].count}
                                ]
                            });
                }
                return res.status(200).json(resdata);
            }
    });
        
}
