define([
    'underscore',
    'jquery',
    'jqueryeasing'
], function (_, $) {
    var Wiki = function (el) {
        this.$el = $(el);
        this.scrolledElTop = -100;
        this.scrolledEl = undefined;
        this.init();
    };
    Wiki.prototype = _.extend({}, {
        onClickItem: function (e) {
            var $target = $(e.currentTarget);
            // $('.nav-pane span').removeClass('st-active');
            // $target.addClass('st-active');

            $('body, html').animate({
                scrollTop: $('.wiki-page[data-wiki-page="' + $target.data('wiki') + '"]').offset().top - ($('.js-header').height() / 2)
            });
        },
        handleScroll: function () {
            if(this.scolledEl !== undefined) {

                var that = this;
                $('.wiki-page').each(function (_, el) {
                    var $win = $(window);
                    var val = $(el).offset().top + 500;
                    if (val > $win.scrollTop() && val < ($win.scrollTop() + $win.height())) {
                        that.scrolledEl = $(el);
                    }

                });

                var wiki = this.scrolledEl.data('wiki-page');

                $('.nav-pane span').removeClass('st-active');
                $('.nav-pane span[data-wiki="' + wiki + '"]').addClass('st-active');
            }
        },
        init: function () {
           $('body').on('click', 'div.nav-pane span', $.proxy(this.onClickItem, this));
           $(window).on('scroll', $.proxy(this.handleScroll, this));
        }
    });
    return Wiki;
});



