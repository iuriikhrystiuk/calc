module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-copy');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    // Project configuration.
    grunt.initConfig({
        app: {
            scripts: ['scripts/**/*.js']
        },
        wiredep: {
            app: {
                src: 'src/index.html'
            }
        },
        includeSource: {
            options: {
                basePath: 'src/',
                baseUrl: '',
                ordering: 'top-down',
                templates: {
                    html: {
                        js: '<script src="{filePath}"></script>',
                        css: '<link rel="stylesheet" type="text/css" href="{filePath}" />'
                    }
                }
            },
            app: {
                files: {
                    'src/index.html': 'src/index.html',
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/scripts/**/*.js'
            ]
        },
        useminPrepare: {
            html: 'src/index.html',
            options: {
                dest: 'dist',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['concat', 'cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        copy: {
            html: {
                src: 'src/index.html',
                dest: 'dist/index.html'
            }
        },
        usemin: {
            html: ['dist/index.html']
        },
        serve: {
            options: {
                port: 9000,
            }
        }
    });


    // Default task(s).
    grunt.registerTask('build', [
        'jshint',
        'wiredep',
        'includeSource',
        'copy:html',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'usemin']);

    grunt.registerTask('default', [
        'jshint', 
        'wiredep', 
        'includeSource', 
        'serve']);
};