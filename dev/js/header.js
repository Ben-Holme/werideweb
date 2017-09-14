define([
	'underscore'
], function (_) {
	var Header = function (el) {
		this.$el = $(el);
		this.$win = $(window);
		this.$body = $('body');
		this.init();
	};
	Header.prototype.init = function () {
		this.$win.on('scroll', _.bind(this.onScrolled, this));
	};
	Header.prototype.onScrolled = function () {
		if (this.$win.scrollTop() > 50) {
			this.$body.addClass("scrolled");
		} else {
			this.$body.removeClass("scrolled");
		}
	};
	return Header;
});