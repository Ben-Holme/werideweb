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

      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      for (var key in body) {
        var jsDate = new Date(body[key].date);


        var day = jsDate.getDate();
        var monthIndex = jsDate.getMonth();
        var year = jsDate.getFullYear();

          var niceDate = day + ' ' + monthNames[monthIndex] + ' ' + year;
        console.log(niceDate);
        body[key].date = niceDate;
      }

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
