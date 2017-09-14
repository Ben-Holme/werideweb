#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var engine = require('ejs-locals');

/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */


    // API FUNCTIONS
    var ip = '5.150.240.115';

    self.getServerStats = function (callback) {
      var request = require('request');
        request.get('http://' + ip + '/ueserv/getServerStats.php', function (err, res, body) {
            if(!err && res.statusCode == 200) {
                callback(body);
            } else {
                callback({date: 'no date', players: 'no players'});
            }
        });
    };
    self.getSessions = function (callback) {
        var request = require('request');
        request.get('http://' + ip + '/ueserv/getSessions.php', function (err, res, body) {
            if(!err && res.statusCode == 200) {
                callback(body);
            } else {
                callback({error: 'server down'});
            }
        });
    };
    self.charLoggedIn = function(a) {
        console.log(a);
        // fs.appendFile(__dirname + '/static/js/test.js', body);
    };
    self.getChars = function (callback) {
		var request = require('request');
        request
			.get('http://' + ip + '/ueserv/getCharStats.php', function (err, res, body) {
                if (!err && res.statusCode == 200) {
                    callback(body);
                } else {
                    //callback({error: {name:§ 'No internet Connection'}});
                    callback({
                        0: {
                            name: 'fake char 1', kills: 45, death: 32, bounty: 55
                        },
                        1: {
                            name: 'fake char 2', kills: 55, death: 32, bounty: 522
                        },
                        2: {
                            name: 'fake char 3', kills: 52, death: 32, bounty: 523
                        },
                        3: {
                            name: 'fake char 4', kills: 232, death: 32, bounty: 442
                        },
                        4: {
                            name: 'fake char 5', kills: 11, death: 32, bounty: 332
                        }
                    });
                }
			});
    };

    self.getCharsFake = function () {
        return [{name: 'namn1', kills: 4}, {name: 'name2', kills: 5}];
    };

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.zcache = "";
        self.routes = { };
        self.routes['/'] = function(req, res) {
            res.render('index.ejs', {
                    isLocal: self.port === 3000,
                    //chars: self.getChars()
                    chars: [{name: 'namn1', kills: 4}, {name: 'name2', kills: 5}]
                }
            );
        };
        self.routes['/stats'] = function(req, res) {
            res.render('stats.ejs', {
                  isLocal: self.port === 3000
              }
            );
        };
        self.routes['/death-clock'] = function(req, res) {
            res.render('death-clock.ejs', {
                    isLocal: self.port === 3000,
                    //chars: self.getChars()
                    chars: [{name: 'namn1', kills: 4}, {name: 'name2', kills: 5}]
                }
            );
        };
        self.routes['/getChars'] = function(req, res) {
            self.getChars(function (body) {
                res.send(body);
            });
        };
        self.routes['/getServerStats'] = function(req, res) {
            self.getServerStats(function (body) {
                res.send(body);
            });
        };
        self.routes['/getSessions'] = function(req, res) {
            self.getSessions(function (body) {
                res.send(body);
            });
        };
        // self.routes['/charLoggedIn'] = function(req, res, body) {
        //     return {req: req, res: res, body: body};
        //     // self.charLoggedIn();
        // };
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();
        self.app.engine('ejs', engine);

        self.app.use(express.static(__dirname));
        self.app.use(express.bodyParser());

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }


        self.app.post('/charLoggedIn', function(req, res) {
            res.send('OK!');
            fs.appendFile(__dirname + '/static/js/log.js',
              'in=' + req.body.date + '&char=' + req.body.char 
            );
        });


    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
            Date(Date.now() ), self.ipaddress, self.port);
        });
        console.log(self.ipaddress);
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();