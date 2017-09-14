module.exports = function (grunt) {
	require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);
	grunt.initConfig({
		express: {
			dev: {
				options: {
					script: 'server.js'
				}
			}
		},
		less: {
			files: {
				src: 'dev/less/app.less',
				dest: 'static/css/app.css'
			}
		},
		watch: {
			less: {
				files: ['dev/less/**/*.less'],
				tasks: ['less', 'postcss'],
				options: {
					livereload: true
				}
			},
			ejs: {
				files: ['views/**/*.ejs'],
				options: {
					livereload: true
				}
			},
			hbs: {
				files: ['dev/**/*.hbs'],
				tasks: ['copy'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['dev/**/*.js', 'static/**/ *.js'],
				tasks: ['copy'],
				options: {
					livereload: true
				}
			}
		},
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: 'node_modules/',
					src: [
						'requirejs/**',
						'jquery/**',
						'jquery-easing/**',
						'handlebars/**',
						'requirejs-text/**',
						'underscore/**',
						'modernizr/**'
					],
					dest: 'static/js/vendor/',
					filter: 'isFile'
				},
				{
					expand: true,
					cwd: 'dev/js/',
					src: ['**'],
					dest: 'static/js/',
					filter: 'isFile'
				},
				{
					expand: true,
						cwd: 'dev/img/',
					src: ['**'],
					dest: 'static/img/',
					filter: 'isFile'
				}]
			}
		},
		postcss: {
			options: {
				map: true, // inline sourcemaps

				processors: [
					//require('pixrem')(), // add fallbacks for rem units
					require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
					require('cssnano')() // minify the result
				]
			},
			dist: {
				src: 'static/css/*.css'
			}
		}
	});
	grunt.registerTask('default', ['express', 'copy', 'watch']);
	grunt.registerTask('build', ['copy', 'less']);
};