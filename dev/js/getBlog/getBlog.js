define([
  'jquery',
  'underscore',
  'handlebars',
  'text!./getBlog.hbs'
], function ($, _, handlebars, template) {
  var data = $.getJSON('/getBlog');
  var tmpl = handlebars.compile(template);
  var GetBlog = function (el) {
    this.$el = $(el);
    this.init();
  };
  GetBlog.prototype.init = function () {
    this.getData();
  };
  GetBlog.prototype.getData = function () {
    var that = this;
    data.done(function (body) {
      that.render(body);
    });
  };
  GetBlog.prototype.render = function (body) {
    this.$el.html(tmpl(body));
    _.delay(_.bind(function () {
      this.$el.addClass('fx');
    }, this), 500);
  };

  return GetBlog;
});
