'use strict'

var jshiki = require('jshiki');
var mongoose = require('mongoose'),
    Rule = mongoose.model('Rule'),
    RulesProcessor = mongoose.model('RulesProcessor'),
    RulesProcessorConfig = mongoose.model('RulesProcessorConfig');

var messagessincelastpurge = 0;
 
// Processes rules locally

var sendresults = function(req,res,httpstatus,payload) {
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
     
     res.status(httpstatus).json(payload);
     savelog(ip,req.params.eventId,req.body.document,payload,httpstatus);
     return;
}

var savelog = function (sourceip,event,reqbody,response,httpstatus) {
    var logentry = new RulesProcessor();
    
    logentry.sourceip = sourceip;
    logentry.event = (event === undefined)?'':event;
    logentry.reqbody = (reqbody===undefined)?'':JSON.stringify(reqbody);
    logentry.response = (response===undefined)?'':JSON.stringify(response);
    logentry.httpstatus = httpstatus;
    
    logentry.save(function(err) {
        if (err) {
            console.log('Cannot save logentry');
        }
        messagessincelastpurge++;
        purgelog();
    });
    return;
}

var testrule = function (statement,testdoc,iscomplexstatement) {
    var expression, result, results,i;
    var listexpr;
    statement = statement.replace(/\n/g,"");
    listexpr = statement.split(',');
    console.log('Evaluating Statement='+statement
                + '\n   Document=' + JSON.stringify({scope:testdoc}));
    results={};                  
    for (i=0;i<listexpr.length;i++){
        var fieldname = '';
        var fieldvalue;
        if (listexpr[i].search(':')<0 || !iscomplexstatement) {
            fieldvalue = listexpr[i];
        } else {
            fieldname = listexpr[i].split(':')[0];
            fieldvalue = listexpr[i].split(':')[1];
        }
        if (fieldname==='') {
            fieldname='var'+i;
        }
        expression = jshiki.parse(fieldvalue,{scope:testdoc});                
        result = expression.eval();
        if (result === undefined) { result = null;}
        console.log('   Eval Result='+result+'\n');
        results[fieldname]=result;
    }
    return results;
}

var parseDocAllRules = function (req,res, event,document) {
    var i=0, results ={};
    // Find all rules: enabled, valid for the timeframe, ordered by execution order
    console.log('Processing event "' + event + '" \nDocument received: ' + JSON.stringify(document));
    Rule.find({
                execWhenKey:event,
                enabled:true,
                validFrom: { $lt: Date.now()},
                validTo: { $gt: Date.now()}
                }).sort('execOrder').exec(function(err, rules) {
                if (err) {
                    sendresults(req,res,500,{"result":{"error": "Cannot find rules to execute"}});
                    return;
                }
                console.log('Rules found for event "' + event + '": ' + rules.length );
                for (i =0; i<=rules.length-1;i++){
                    results.resExecIf = null;
                    results.resExecThen = null;
                    results.resExecElse = null;
                    console.log('Evaluating rule: ' + rules[i].name);
                    try {
                        if ( rules[i].execIf !== undefined ) {
                            results.resExecIf = testrule(rules[i].execIf,
                                                document,false);
                        }
                        if ( rules[i].execThen !== undefined ) {
                            results.resExecThen = testrule(rules[i].execThen,
                                                document,true);
                        }
                        if ( rules[i].execElse !== undefined ) {
                            if ( rules[i].execElse !== '' ) {
                                results.resExecElse = testrule(rules[i].execElse,
                                                    document,true);
                            }
                        }
                        if (results.resExecIf.var0 === true ) {  // tests also the type to be boolean
                            sendresults(req,res,200,(results.resExecThen === null) ? {"result":{}}: {"result":results.resExecThen});
                            return;
                        }
                        if (results.resExecIf === false && results.resExecElse !== null) {
                            sendresults(req,res,200,{"result":results.resExecElse});
                            return;
                        }                        
                    } catch  (ex) {
                        console.log('Error in rule: ' + rules[i].name + ', skipped');
                        continue;
                    }
                // continues with next rule               
                }
                // No rule matched, return 200 with no payload
                sendresults(req,res,200,{"result":{}});
            });
}

exports.processevent = function(req,res) {
        var results;
        
        // Validate inbound message
        if (req.params.eventId === undefined ){
            sendresults(req,res,400,{"error": "Missing event name in URL"});
            return;
        }
        console.log(req.headers['content-type']);
        if (req.headers['content-type'] !== 'application/json' ) {
            sendresults(req,res,422,{"error": "Only allowed Content-Type: application/json"});
            return;
        }
        if ( req.body === undefined ) { 
            sendresults(req,res,422,{"error": "Invalid json document in body"});
            return;
        };
        if ( req.body.document === undefined ) { 
            sendresults(req,res,422,{"error": "Missing document to evaluate in body"});
            return;
        };
        results ={};
        if (req.body.execIf !== undefined) { // IF/THEN/ELSE statements included as a test message 
            try {
                    if ( req.body.execIf !== undefined ) {
                        results.resExecIf = testrule(req.body.execIf,
                                            req.body.document,false);
                    } 
                } catch (ex) {
                    return sendresults(req,res,400,{error:'Error in IF expression or document ' + ex});
                }
            try {
                    if ( req.body.execThen !== undefined ) { 
                        results.resExecThen = testrule(req.body.execThen,
                                            req.body.document,true);
                    }
                } catch (ex) {
                    return sendresults(req,res,400,{error:'Error in Then expression or document' + ex}); 
                }
            try {
                    if ( req.body.execElse !== undefined ) {
                    if ( req.body.execElse !== '' ) { 
                        results.resExecElse = testrule(req.body.execElse,
                                            req.body.document,true);
                    }
                    }
                } catch (ex) {
                    return sendresults(req,res,400,{error:'Error in Else expression or document' + ex}); 
                }
            //res.status(200).json(results);
            sendresults(req,res,200,results); 
            return;
        };
        // This is a standard message only document (rules to be read from dB)
        parseDocAllRules(req,res, req.params.eventId,  req.body.document);
        return;  
}


exports.getlogentries = function(req,res) {
    var perPage = 20
        , page = req.param('page') > 0 ? req.param('page') : 1

    RulesProcessor
        .find()
        .limit(perPage)
        .skip(perPage * (page -1))
        .sort('-timestamp')
        .exec(function (err, events) {
        RulesProcessor.count().exec(function (err, count) {
            res.json({"events":events
            , page: page
            , pages: count / perPage
            , totalitems: count
            });
        })
        })    
}


  

exports.clearentries = function(req,res) {
    RulesProcessor.remove({}, function(err) {
            if (err) {
                    console.log('Error removing log entries');
            }
            else {
                    console.log('Removed log entries');
            }
        });
    res.status(200).json({"result":"OK"});
}

var purgelog = function() {
    // since purging is a costly operation, only happens every 10 processed messages.
    // Number 10 is arbitrary and not persisted in the DB on purpose
    
    if (messagessincelastpurge<10) {
        return;
    }    
    RulesProcessorConfig.find({})
                .exec(function(err, entries) {
                if (err) {
                    console.log('Cannot purge log entries');
                    };               
                if (entries.length>0) {
                    if (entries[0].keeplasttype==='E')
                        RulesProcessor
                            .find()
                            .sort('-timestamp')
                            .skip(entries[0].keeplast)
                            .exec(function(err,docs) {
                                if (err) {
                                        console.log('Error purgin log entries');
                                }
                                else {
                                    docs.forEach( function (doc) {
                                        doc.remove();
                                    });
                                    console.log('Purged log entries');
                                    messagessincelastpurge =0;
                                }
                                });               
                    };
                });    
    
}
