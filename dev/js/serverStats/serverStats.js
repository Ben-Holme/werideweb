define([
  'jquery',
  'underscore',
  'handlebars',
  'text!./getServerStats.hbs'
], function ($, _, handlebars, template) {
  window.weride = {
		server: {
			start: '',
			end: '',
			longSession: false
		},
		chars: []
	};
	var weride = window.weride;
	var now = new Date().setHours(new Date().getUTCHours());

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function fixData(data) {
		function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
		function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
		var chars = data.reduce(function (acc, session, i) {
			if (acc[session.id]) {
				return _extends({}, acc, _defineProperty({}, session.id, _extends({}, acc[session.id], {
					sessions: [].concat(_toConsumableArray(acc[session.id].sessions), [{ start: session.start, end: session.end }])
				})));
			}
			return _extends({}, acc, _defineProperty({}, session.id, {
				char: session.char,
				sessions: [{ start: session.start, end: session.end }]
			}));
		}, {});

		return chars;
	}

	var fixZero = function (str) {
		str = str.toString();
		return (str.length === 1 ? '0' + str : str);
	};
  
  var tmpl = handlebars.compile(template);
  var GetServerStats = function (el) {
    this.$el = $(el);
    this.init();
  };
  GetServerStats.prototype.init = function () {
		this.poll();
  };
  GetServerStats.prototype.poll = function () {
		this.gatherData();
		var that = this;
    setTimeout(function() {
			now = new Date().setHours(new Date().getUTCHours());
			that.poll();
    }, 60 * 1000);
	};
  GetServerStats.prototype.gatherData = function () {
    var data = $.getJSON('/GetSessions');
		var that = this;

		// GET SERVER DATA
		data.done(function(body) {
			// GAME DATE TO JS DATE
			body.forEach(function(sess) {
				sess.start = that.toJsDate(sess.start);
				if(sess.end !== '0') {
					sess.end = that.toJsDate(sess.end);
				}
			});
			// FILTER OUT OLD SESSIONS (older than 3 days)
			var days = (3 * 1000 * 60 * 60 * 24);
			body = body.filter(function(sess) {
				if(sess.end === '0' || (now - sess.end) < days) {
					return sess;
				}
			});

			// PICK CHARS FROM DATA
			weride.chars = fixData(body);

			// PICK AND SET SERVER START, END & ONLINE
			var firstServerSess = 9999999999999;
			var serverLongSession = false;
			weride.chars[-1].sessions.forEach(function(sess) {
				firstServerSess = sess.start < firstServerSess ? sess.start : firstServerSess;
			});
			if(((now - firstServerSess) > days)) {
				serverLongSession = true;
				firstServerSess = (now - days);
			}
            var lastServerSessEnd = 0;
            var currentStart = 0;
			weride.chars[-1].sessions.forEach(function(sess) {
				if (sess.end > lastServerSessEnd) {
					lastServerSessEnd = sess.end;
					currentStart = sess.start;
				}
			});
			var isOnline = (lastServerSessEnd + (5 * 60000)) > now;

			weride.server = {
				start: firstServerSess,
				end: lastServerSessEnd,
				currentStart: currentStart,
				online: isOnline,
				longSession: serverLongSession
			};

			// FILTER OUT BAD SESSIONS THAT STARTED IN PREVIOUS SERVER SESSIONS
			Object.keys(weride.chars).forEach(function(key) {
				if (key !== '-1') {
					weride.chars[key].sessions = weride.chars[key].sessions.filter(function(sess) {
						return sess.start >= weride.server.start;
					});
				}
			});

			// REMOVE TEST CHAR
			delete weride.chars[0];

			// REMOVE EMPTY SESSIONS
			Object.keys(weride.chars).forEach(function(key) {
				if(weride.chars[key].sessions.length === 0 && key !== '-1') {
					delete weride.chars[key];
				}
			});

			that.renderSessions();

			// MAKE PLAYER ARRAY FOR SERVER STATS
			var players = [];
			Object.keys(weride.chars).forEach(function(key) {
				weride.chars[key].sessions.find(function(session) {
					if(session.end === '0' && weride.chars[key].char !== 'server') {
						if(!players.includes(weride.chars[key].char)) {
							players.push(weride.chars[key].char);
						}
					}
				});
			});
			if(weride.server.online) {
				that.renderServerStats({online: true, players: players, nOfPlayers: players.length});
			} else {
				var date = new Date(weride.server.end);
				that.renderServerStats({online: false, date: date.getDate() + '/' + (date.getMonth() + 1) + ' ' + fixZero(date.getHours()) + ':' + fixZero(date.getMinutes())});
			}
		});
	};
  GetServerStats.prototype.toJsDate = function (dateString) {
		var dateArray = dateString.split('-');
		var s =
			dateArray[0] +
			'-' +
			fixZero(dateArray[1]) +
			'-' +
			fixZero(dateArray[2]) +
			'T' +
			fixZero(dateArray[3]) +
			':' +
			fixZero(dateArray[4])
			'+01:00' // sommartid
	  		;
		return new Date(s).getTime();
	};
  GetServerStats.prototype.renderServerStats = function (d) {
    this.$el.html(tmpl(d));
		this.$el.addClass('active');
  };
	GetServerStats.prototype.renderSessions = function() {
		function getMinAgo(mil) {
			return mil === '0' ? 0 : (now - mil) / 60000;
		}

		function timeFormat(mil) {
			var d = new Date(mil);
			var hours = d.getHours();
			var mins = d.getMinutes();

			if (hours < 10) {hours = '0' + hours;}
			if (mins < 10) {mins = '0' + mins;}

			return hours + ':' + mins;
		}

		var chars = weride.chars;
		var serverStart = getMinAgo(weride.server.start);
		var charMarkup = "";
		Object.keys(chars).forEach(function(key) {
			var sessionsMarkup = "";
			chars[key].sessions.forEach(function(session) {
				var active;
				var left;
				var right;
				if (key === '-1') {
                    var isActiveServerSession = session.end === weride.server.end && weride.server.online;
                    active = session.end === '0' || isActiveServerSession;
                    left = (((serverStart - getMinAgo(session.start)) / serverStart) * 100) + '%';
                    right = session.end ? ((getMinAgo(session.end) / serverStart) * 100) + '%' : '0' + '%';

                    sessionsMarkup +=
                        '<div class="session' +
                        (active ? ' active' : '') +
                        '" style="right:' + (active ? '0' : right) + ';left:' + left + '"><span class="color"></span>' +
                        '<span class="start">' + timeFormat(session.start) + '</span>' +
                        (!active ? ('<span class="end">' + timeFormat(session.end) + '</span>') : '') +
                        '</div>';
				} else {
                    if (chars[key].char === 'Mecca') {
						console.log(new Date(session.start), new Date(weride.server.end));
					}

					var crashed = session.end === '0' && session.start < weride.server.currentStart;
					if (crashed) {

                        chars['-1'].sessions.forEach(function(sess) {
                        	if(session.end === '0') {
								var afterStart = new Date(session.start) >= new Date(sess.start);
								var beforeEnd = new Date(session.start) <= new Date(sess.end);



                                if (chars[key].char === 'Mecca') {
									console.log(afterStart, beforeEnd, new Date(sess.start), new Date(sess.end));
                                }
								if (beforeEnd && afterStart || !afterStart && beforeEnd) {
									session.end = sess.end;
                                    if (chars[key].char === 'Mecca') {
										console.log(new Date(session.end));
                                    }
								}
							}
                        });
					}


                    active = session.end === '0';
                    left = (((serverStart - getMinAgo(session.start)) / serverStart) * 100) + '%';
                    right = !active ? ((getMinAgo(session.end) / serverStart) * 100) + '%' : '0' + '%';
                    if (chars[key].char === 'Mecca') {
                        console.log(right, active);
                    }
                    sessionsMarkup +=
                        '<div class="session' +
                        (active ? ' active' : '') +
                        '" style="right:' + right + ';left:' + left + '"><span class="color"></span>' +
                        '<span class="start">' + timeFormat(session.start) + '</span>' +
                        (!active ? ('<span class="end">' + timeFormat(session.end) + '</span>') : '') +
                        '</div>';
				}
				//var isActiveServerSession = key === '-1' && session.end === weride.server.end && weride.server.online;
				//var active = session.end === '0' || isActiveServerSession;
				// console.log(isActiveServerSession, weride.server);
				//var left = (isActiveServerSession && weride.server.longSession) ? '0' : (((serverStart - getMinAgo(session.start)) / serverStart) * 100) + '%';
				//var right = session.end ? ((getMinAgo(session.end) / serverStart) * 100) + '%' : '0' + '%';
				// sessionsMarkup +=
				// 	'<div class="session' +
				// 	(active ? ' active' : '') + ((isActiveServerSession && weride.server.longSession) ? ' long' : '') +
				// 	'" style="right:' + (active ? '0' : right) + ';left:' + left + '"><span class="color"></span>' +
				// 	'<span class="start">' + timeFormat(session.start) + '</span>' +
				// 	(!active ? ('<span class="end">' + timeFormat(session.end) + '</span>') : '') +
				// 	'</div>';
			});
			charMarkup = '<div class="char' + (key === '-1' ? ' server' : '') + '"><span class="name">' + chars[key].char + '</span>' + sessionsMarkup + '</div>' + charMarkup;
		});

		var hours = [];
		for(var i = parseInt((getMinAgo(weride.server.start) / 60), 10) -1; i >= 0; i--) {
			var date = new Date(weride.server.start);
			date.setMinutes(0);
			date.setHours((date.getHours() + i) +1);
			hours.push(date);
		}

		hours.reverse();

		var a = '';
		hours.forEach(function(hour) {
		 	a += '<span' + (hour.getHours() === 0 ? ' class="day" ' : '') + '>' + (hour.getHours() === 0 ? '<i>' + hour.getDate() + '/' + (hour.getMonth()+1) + '</i>' : '<span>' + hour.getHours() + '</span>') + '</span>';
		});

		var timeLineSize = ' one-day';
		timeLineSize = hours.length > 24 ? ' two-days' : timeLineSize;
		timeLineSize = hours.length > 48 ? ' three-days' : timeLineSize;
		var markers = hours[0] ? '<div class="markers' + timeLineSize + '" style="' +
		'left:' + (((serverStart - getMinAgo(hours[0].getTime())) / serverStart) * 100) + '%;' +
		'right:' + ((getMinAgo(hours[hours.length-1].getTime()) / serverStart) * 100) + '%">' +
		a + '</div>' : '';

		$('.sessions').html(
			'<div>' + markers + charMarkup + '</div>'
		);
	};
  return GetServerStats;
});