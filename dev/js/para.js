define([
	'underscore',
	'jquery',
	'jqueryeasing'
], function (_, $) {
	var Para = function (el) {
		this.$el = $(el);
		this.init();
	};
	Para.prototype = _.extend({}, {
		init: function () {
			this.bind();
			this.onScroll();
		},
		bind: function () {
			$(window).on('scroll', _.bind(this.onScroll, this));
		},
		onScroll: function () {
			window.requestAnimationFrame(function () {
				var scrollTop = $(window).scrollTop();
				$('.para').each(function (i, el) {
					var offset = $(el).offset().top;
          var val = (scrollTop - offset + 50) * 0.1;
					$(el).find('.img').css('transform', 'translate(0, ' + val + 'px)');
				});
			});
		}
	});
	return Para;
});



