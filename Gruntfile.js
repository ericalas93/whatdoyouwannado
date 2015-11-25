module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				files: {
					'css/style.css' : 'sass/style.scss'
				}
			}
		},
		browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'css/*.css',
                        '*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    files: ['css/style.css'],
                    proxy: "localhost:80",
                    notify: false
                }
            }
        }, 
		watch: {
			css: {
				files: 'sass/*.scss',
				tasks: ['sass']
			}
		}, 
		concat: {
		    options: {
		      separator: '\n',
		    },
		    dist: {
		      src: ['src/app.js', 'controllers/*.js', 'directives/*.js', 'factories/*.js'],
		      dest: 'dist/app.js',
		    }
		 }, 
		 ngAnnotate: {
	        angular: {
	            files: {
	                'dist/app.js': ['dist/app.js']
	            },
	        }
	    }, 
	    uglify: {
			angular: {
        	    files: {
                	'dist/app.min.js': ['dist/app.js']
            	}
        	}
		}
	    
		 
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	
	grunt.registerTask('default',['browserSync', 'watch']);
	grunt.registerTask('angular-production', "Concat, prepare, minify, and uglify Angular app", function(){
		grunt.task.run(['concat','ngAnnotate','uglify']);
	});
}