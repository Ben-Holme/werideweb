require.config({
	baseUrl: '/static/js/',
	paths: {
		jquery: 'vendor/jquery/dist/jquery',
		jqueryeasing: 'vendor/jquery-easing/dist/jquery.easing.1.3.umd',
		handlebars: 'vendor/handlebars/dist/handlebars',
		underscore: 'vendor/underscore/underscore',
		'text': 'vendor/requirejs-text/text',
		modernizr: 'modernizr-custom'
	}
});

require(['jquery', 'modernizr'], function ($) {
	$(document).ready(function () {
		var $jsGetChars = $(".js-get-chars");
		if($jsGetChars.length) {
			require(['getChars/getChars'], function (Constructor) {
				new Constructor($jsGetChars);
			});
		}
		var $jsHeader = $('.js-header');
		if($jsHeader.length) {
			require(['header'], function (Constructor) {
				new Constructor($jsHeader);
			});
		}
		var $deathClock = $('.death-clock');
		if($deathClock.length) {
			require(['deathClock'], function (Constructor) {
				new Constructor($deathClock);
			});
		}
		var $pages = $('.pages');
		if($pages.length) {
			require(['pages'], function (Constructor) {
				new Constructor($pages);
			});
		}
		var $para = $('.para');
		if($para.length) {
			require(['para'], function (Constructor) {
				new Constructor($para);
			});
		}
		var $video = $('video');
		if($video.length) {
			require(['video'], function (Constructor) {
				new Constructor($video);
			});
		}
		var $serverStats = $('.server-stats');
		if($serverStats.length) {
			require(['serverStats/serverStats'], function (Constructor) {
				new Constructor($serverStats);
			});
		}
        var $tabs = $('.tabs');
        if($tabs.length) {
            require(['tabs'], function (Constructor) {
                new Constructor($tabs);
            });
        }
        var $wiki = $('.wiki');
        if($wiki.length) {
            require(['wiki'], function (Constructor) {
                new Constructor($wiki);
            });
        }
	});
});