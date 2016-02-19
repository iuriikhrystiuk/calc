module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-copy');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-htmlmin');
    
    // Project configuration.
    grunt.initConfig({
        app: {
            scripts: [
                'scripts/modules/*.js',
                'scripts/constants/*.js',
                'scripts/*.js',
                'scripts/services/*.js',
                'scripts/controllers/*.js'
            ]
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
        htmlmin: {
            app: {
                options: {
                    removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    keepClosingSlash: true
                },
                files: {
                    src: 'dist/*.html',
                    dest: '.'
                }
            }
        },
        ngtemplates: {
            app: {
                src: 'src/views/**/*.html',
                dest: '.tmp/templates/app.templates.js',
                options: {
                    module: 'rps',
                    usemin: 'dist/js/app.js',
                    htmlmin: '<%= htmlmin.options %>'
                }
            }
        },
        'http-server': {
            dev: {
                root: 'src',
                port: 9090,
                autoIndex: true,
                // server default file extension 
                ext: "html"
            },
            prod: {
                root: 'dist',
                port: 9090,
                autoIndex: true,
                // server default file extension 
                ext: "html"
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
        'ngtemplates',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'usemin',
        'htmlmin']);

    grunt.registerTask('default', [
        'jshint',
        'wiredep',
        'includeSource',
        'http-server:dev']);

    grunt.registerTask('prod', [
        'build',
        'http-server:prod']);
};