define([
	'underscore',
	'jquery',
	'jqueryeasing'
], function (_, $) {
	var Pages = function (el) {
		this.$el = $(el);
		this.$control = this.$el.find('.control');
		this.currentIndex = 0;
		this.isAutoScrolling = false;
		this.$scrollEl = $('html, body');
		this.$scrollBtn = $('.scroll-btn');
		this.preventHash = false;
		this.init();
	};
	Pages.prototype = _.extend({}, {
		init: function () {
      this.getHash();
			this.setUp();
			this.bind();
		},
		setUp: function () {
			this.$pages = this.$el.find('.page');
      this.$pages.css('display', 'block');
      this.$pages.eq(this.currentIndex).addClass('active').removeClass('dont-push');
			var that = this;
      var loader = this.$control.find('.dots-loader');
      loader.addClass('hide');
      setTimeout(function () {
        loader.remove();
        that.$pages.each(function(i, el) {
          var html = '<span class="nav-button' + (i === that.currentIndex ? ' active' : '') + '">' + $(el).data('name') + '</span>';
          that.$control.append(html);
          setTimeout(function () {
            that.$control.addClass('active');
          }, 10);
        });
      }, 500);
		},
		bind: function () {
			this.$el.on('click', '.control span.next', _.bind(this.nextPage, this));
			this.$el.on('click', '.control span.prev', _.bind(this.prevPage, this));
			this.$el.on('click', '.control span.nav-button', _.bind(this.onClickNavButton, this));
			this.$el.on('click', 'span.page-btn', _.bind(this.onClickPageButton, this));
			this.$scrollBtn.on('click', _.bind(this.onClickScrollButton, this));
			this.$pages.on('mousewheel', _.bind(this.onMouseWheel, this));
			$(window).on('hashchange', _.bind(this.onHashChange, this));
		},
		onHashChange: function (e) {
			if(!this.preventHash) {
				this.getHash();
				this.gotoPage(this.currentIndex);
			}
		},
    getHash: function () {
      var hash = window.location.hash.toLowerCase();
      if(hash !== '') {
        var index = this.$el.find('.page[data-name=' + window.location.hash.replace('#', '') + ']').index() - 1;
        this.currentIndex = index < 0 ? 0 : index;

		this.$el.attr({'data-page': this.currentIndex});
      }
    },
    onClickPageButton: function (e) {
      var that = this;
      setTimeout(function () {
        var pageIndex = $(e.currentTarget).data('index');
        that.gotoPage(pageIndex);
      }, 0);
    },
		onClickScrollButton: function (e) {
      var that = this;
      setTimeout(function () {
        var $el = $(e.currentTarget);
        var targetHeight = $el.closest('section').next('section').position().top;
        that.$scrollEl.animate({scrollTop: targetHeight});
      }, 200);
		},
		autoScrollCooldown: function () {
			this.isAutoScrolling = true;
			var that = this;
			setTimeout(function () {
				that.isAutoScrolling = false;
			}, 1000);
		},
		onMouseWheel: function (e) {
			var delta = e.originalEvent.wheelDelta;
			var scrolledDown = delta < 0;
			var $scrolledSection = $(e.target).closest('section');
			if(this.isAutoScrolling) {
				e.preventDefault();
				e.stopPropagation();
				return;
			}
			if($scrolledSection.data('locked-scroll') === true) {
				e.preventDefault();
				e.stopPropagation();
				if(delta < 10 && delta > -10) {
					return;
				}
				this.autoScrollCooldown();
				if(scrolledDown) {
					this.$scrollEl.animate({scrollTop: $scrolledSection[0].offsetTop + $scrolledSection.height()}, 1000, 'easeOutQuint');
				} else if(!scrolledDown) {
					var scrollTop = $(window).scrollTop();
					if(scrollTop > $scrolledSection.offset().top) {
						this.$scrollEl.animate({scrollTop: $scrolledSection[0].offsetTop}, 500, 'easeOutQuint');
						return;
					}
					this.$scrollEl.animate({scrollTop: $scrolledSection[0].offsetTop - $scrolledSection.height()}, 1000, 'easeOutQuint');
				}
			}
		},
		onClickNavButton: function (e) {
			this.gotoPage($(e.currentTarget).index());
		},
		nextPage: function () {
			this.gotoPage(this.currentIndex + 1);
		},
		prevPage: function () {
			this.gotoPage(this.currentIndex - 1);
		},
		gotoPage: function (newIndex) {
			this.preventHash = true;
			var that = this;
			var goLeft = newIndex < this.currentIndex;
			var activeClass = 'active' + (goLeft ? ' go-left' : '');
			var inactiveClass = 'inactive' + (goLeft ? ' go-left' : '');
			var oldIndex = this.currentIndex;
			this.currentIndex = newIndex;
      window.location.hash = this.$control.find('span').eq(newIndex).text().toLowerCase();
			this.$pages.removeClass('active inactive go-left');
			that.$pages.eq(oldIndex).addClass(inactiveClass);
			setTimeout(function () {
				that.$pages.eq(oldIndex).addClass('dont-push');
			}, 500);

			// the new page
			this.$pages.eq(this.currentIndex)
				.addClass(activeClass)
				.trigger('scroll');
			_.defer(function () {
					that.$pages.eq(that.currentIndex).removeClass('go-left');
			});
			setTimeout(function () {
				that.$pages.eq(that.currentIndex).removeClass('dont-push');
				that.$pages.removeClass('inactive go-left');
				that.$scrollEl.scrollTop(0);
				that.preventHash = false;
			}, 500);
			this.$control.find('span').removeClass(activeClass);
			this.$control.find('span').eq(this.currentIndex).addClass(activeClass);

            that.$el.attr({'data-page': this.currentIndex});
		}
	});
	return Pages;
});



