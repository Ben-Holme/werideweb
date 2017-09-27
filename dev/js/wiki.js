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
            var that = this;
            $('.wiki-page').each(function (_, el) {
                var $win = $(window);
                var val = $(el).offset().top + 500;
                if (val > $win.scrollTop() && val < ($win.scrollTop() + $win.height())) {
                    that.scrolledEl = $(el);
                }

                // if (val < 0 && val > that.scrolledElTop) {
                //     console.log('jga');
                //     that.scrolledElTop = val;
                //     that.scrolledEl = $(el);
                // } else if (that.scrolledEl === undefined) {
                //     that.scrolledElTop = -100;
                //     that.scrolledEl = $('.wiki-page[data-wiki-page="intro"]');
                // } else {
                //     that.scrolledElTop = that.scrolledEl.offset().top - $(window).scrollTop();
                // }
            });

            var wiki = this.scrolledEl.data('wiki-page');
            console.log('.nav-pane span[data-wiki="' + wiki + '"]');

            $('.nav-pane span').removeClass('st-active');
            $('.nav-pane span[data-wiki="' + wiki + '"]').addClass('st-active');
        },
        init: function () {
           $('body').on('click', 'div.nav-pane span', $.proxy(this.onClickItem, this));
           $(window).on('scroll', $.proxy(this.handleScroll, this));
        }
    });
    return Wiki;
});



