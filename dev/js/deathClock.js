define([
	'underscore'
], function (_) {
	var DeathClock = function (el) {
		this.$el = $(el);
		this.totalSecondsLeft = 1576800000;
		this.init();
	};
	DeathClock.prototype = _.extend({}, {
		init: function () {
			this.startClock();
		},
		startClock: function () {
			var yearsLeftRaw = (((this.totalSecondsLeft / 60) / 60) / 24) / 365;
			var yearsLeft = Math.floor(yearsLeftRaw);
			var daysLeftRaw = (yearsLeftRaw - yearsLeft) * 365;
			var daysLeft = Math.floor(daysLeftRaw);
			var hoursLeftRaw = (daysLeftRaw - daysLeft) * 24;
			var hoursLeft = Math.floor(hoursLeftRaw);
			var minutesLeftRaw = (hoursLeftRaw - hoursLeft) * 60;
			var minutesLeft = Math.floor(minutesLeftRaw);
			var secondsLeftRaw = (minutesLeftRaw - minutesLeft) * 60;
			var secondsLeft = Math.floor(secondsLeftRaw);

			$('.years').text(yearsLeft);
			$('.days').text(daysLeft);
			$('.hours').text(hoursLeft);
			$('.minutes').text(minutesLeft);
			$('.seconds').text(secondsLeft);
			this.clockRender();
			setInterval(_.bind(this.clockCountDown, this), 1000);
		},
		clockCountDown: function () {
			this.totalSecondsLeft --;
			console.log(this.totalSecondsLeft);
			this.clockRender();
		},
		clockRender: function () {
			var yearsLeftRaw = (((this.totalSecondsLeft / 60) / 60) / 24) / 365;
			var yearsLeft = Math.floor(yearsLeftRaw);
			var daysLeftRaw = (yearsLeftRaw - yearsLeft) * 365;
			var daysLeft = Math.floor(daysLeftRaw);
			var hoursLeftRaw = (daysLeftRaw - daysLeft) * 24;
			var hoursLeft = Math.floor(hoursLeftRaw);
			var minutesLeftRaw = (hoursLeftRaw - hoursLeft) * 60;
			var minutesLeft = Math.floor(minutesLeftRaw);
			var secondsLeftRaw = (minutesLeftRaw - minutesLeft) * 60;
			var secondsLeft = Math.floor(secondsLeftRaw);

			$('.years').text(yearsLeft);
			$('.days').text(daysLeft);
			$('.hours').text(hoursLeft);
			$('.minutes').text(minutesLeft);
			$('.seconds').text(secondsLeft);
		}
	});
	return DeathClock;
});