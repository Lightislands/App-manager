module.exports = function(grunt) {

    grunt.initConfig({
        less: {
            dist: {
                files: {
                    'css/style.css': 'css/style.less'
                }
            }
        },


        concat: {
            dist: {
                src: [
                    	'js/jquery-2.1.1.min.js',
                    	'js/materialize.min.js',
			            'js/model.js',
			            'js/ui.js',
			            'js/controller.js'
                ],
                dest: 'build/production.js'
            }
        },

        watch: {
            less: {
                files: ['css/*.less'],
                tasks: ['less'],
                options: {
                    livereload: true
                }
            },




            concat: {
                files: ['js/*.js'],
                tasks: ['concat']
            },
            options: {
                livereload: true
            }





        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', 'less');
};