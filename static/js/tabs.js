define([
	'underscore',
	'jquery',
	'jqueryeasing'
], function (_, $) {
	var Pages = function (el) {
		this.$el = $(el);
		this.$scrollEl = $('html, body');
		this.init();
	};
	Pages.prototype = _.extend({}, {
		init: function () {
			this.bind();
		},
		bind: function() {
			this.$el.on('click', 'nav label', _.bind(this.scrollTo, this));
		},
		scrollTo: function() {
			this.$scrollEl.animate({scrollTop: this.$el[0].offsetTop}, 1000, 'easeOutQuint');
		}
	});
	return Pages;
});



