define([
	'jquery',
	'underscore',
	'handlebars',
	'text!./getChars.hbs'
	], function ($, _, handlebars, template) {
	var data = $.getJSON('/getChars');
	var tmpl = handlebars.compile(template);
	var GetChars = function (el) {
		this.$el = $(el);
		this.init();
	};
	GetChars.prototype.init = function () {
		this.getData();
	};
	GetChars.prototype.getData = function () {
		var that = this;
		data.done(function (body) {
			var filterData = that.filter(body);
			var sortedData = that.sort(filterData);
			var slicedData = that.slice(sortedData);
			that.render(slicedData);
		});
		data.error(function (body) {
			that.sort(body);
		});
	};
	GetChars.prototype.filter = function (data) {
			return _.filter(data, function (item, i) {
				if(item.bounty > 0) {
					return item.bounty
				}
			});
	};
	GetChars.prototype.sort = function (data) {
		var sortedData = _.sortBy(data, 'bounty');
		sortedData.reverse();
		_.map(sortedData, function(item, i) {
			item.place = i + 1;
		});
		return sortedData;
		//this.render(sortedData);
	};
	GetChars.prototype.slice = function (data) {
		return data.slice(0, 6);
	};
	GetChars.prototype.render = function (data) {
		this.$el.html(tmpl(data));
		_.delay(_.bind(function () {
			this.$el.addClass('fx');
		}, this), 500);
	};
	return GetChars;
});