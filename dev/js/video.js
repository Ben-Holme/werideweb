define([
	'underscore',
	'jquery'
], function (_, $) {
	var Video = function (el) {
		this.$el = $(el);
		this.init();
	};
	Video.prototype = _.extend({}, {
		init: function () {
			setTimeout(function () {
				$('video').each(function (i, video) {
					$(video).addClass('active');
					video.play();
				});
			}, 500);
		}
	});
	return Video;
});



