module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' +
                ' *\n' +
                ' * <%= pkg.name %> <%= pkg.version %> \n' +
                ' * Author: <%= pkg.author %> http://www.cngrgroup.com/\n' +
                ' * GIT: <%= pkg.repository.url %>\n' +
                ' *\n' +
                ' * The <%= _.pluck(pkg.licenses, "type").join(", ") %> License (<%= _.pluck(pkg.licenses, "type").join(", ") %>)\n' +
                ' * Copyright (C) <%= grunt.template.today("yyyy") %> CNGR GROUP, LLC\n' +
                ' *\n' +
                ' * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n' +
                ' *\n' +
                ' * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n' +
                ' *\n' +
                ' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n' +
                ' **/\n',
        watch: {
            scripts: {
                files: ['test/*.js','test/*.html','src/*.js'],
                tasks: ['default']
            }
        },
        uglify: {
            options: {
                mangle: false,
                banner: '<%= banner %>'
            },
            'dist/Polaroid-Photo-Stack-min.js': [ 'src/Polaroid-Photo-Stack.js' ]
        },
        qunit: {
            all: {
                options: {
                    urls: [ '1.9.1', '1.8.3', '1.7.2', '1.6.4', '1.5.2', '1.4.4'  ].map(function (version) {
                        return 'http://localhost:8000/test/test.html?jquery=' + version;
                    })
                }
            }
        },
        jshint: {
            all: [ 'src/Polaroid-Photo-Stack.js' ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        clean: [ 'dist/Polaroid-Photo-Stack-min.js', 'dist/Polaroid-Photo-Stack.js' ],
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: ['src/Polaroid-Photo-Stack.js'],
                dest: 'dist/Polaroid-Photo-Stack.js'
            }
        },
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [ 'clean', 'analysis', 'test', 'package' ]);
    grunt.registerTask('test', [ 'connect', 'qunit' ]);
    grunt.registerTask('analysis', [ 'jshint' ]);
    grunt.registerTask('package', [ 'uglify' , 'concat' ]);
    grunt.registerTask('compass', [ 'compass' ]);
};


