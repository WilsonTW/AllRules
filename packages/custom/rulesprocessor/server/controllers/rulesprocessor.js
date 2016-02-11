'use strict'

var jshiki = require('jshiki');
var mongoose = require('mongoose'),
    Rule = mongoose.model('Rule'),
    RulesProcessor = mongoose.model('RulesProcessor');
    
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
    });
    return;
}

var testrule = function (statement,testdoc) {
    var expression = jshiki.parse(statement,{scope:testdoc});
    var result;
    console.log('Evaluating Statement='+statement
                + '\n   Document=' + JSON.stringify({scope:testdoc}));
    result = expression.eval();
    if (isNaN(result) || result === undefined) { result = null;}
    console.log('\n   Eval Result='+result);
    return result ; 
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
                                                document);
                        }
                        if ( rules[i].execThen !== undefined ) {
                            results.resExecThen = testrule(rules[i].execThen,
                                                document);
                        }
                        if ( rules[i].execElse !== undefined ) {
                            if ( rules[i].execElse !== '' ) {
                                results.resExecElse = testrule(rules[i].execElse,
                                                    document);
                            }
                        }
                        if (results.resExecIf === true ) {  // tests also the type to be boolean
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
        if (req.query.doctype === undefined && req.query.doctype !== 'json') {
            sendresults(req,res,422,{"error": "Doctypes allowed: json"});
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
                                            req.body.document);
                    } 
                } catch (ex) {
                    return sendresults(req,res,400,{error:'Error in IF expression or document ' + ex});
                }
            try {
                    if ( req.body.execThen !== undefined ) { 
                        results.resExecThen = testrule(req.body.execThen,
                                            req.body.document);
                    }
                } catch (ex) {
                    return sendresults(req,res,400,{error:'Error in Then expression or document' + ex}); 
                }
            try {
                    if ( req.body.execElse !== undefined ) { 
                        results.resExecElse = testrule(req.body.execElse,
                                            req.body.document);
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
    RulesProcessor.find({}).sort('-timestamp')
                .exec(function(err, entries) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the log entries'
                    });
                }

                res.json(entries)
            });    
    
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