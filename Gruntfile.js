module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: false,
                banner: '/**\n' +
                    ' *\n' +
                    ' * <%= pkg.name %> <%= pkg.version %> \n' +
                    ' * Author: <%= pkg.author %> http://www.cngrgroup.com/\n' +
                    ' * GIT: <%= pkg.repository.url %>\n' +
                    ' *\n' +
                    ' * The MIT License (MIT)\n' +
                    ' * Copyright (C) 2012 CNGR GROUP, LLC\n' +
                    ' *\n' +
                    ' * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n' +
                    ' *\n' +
                    ' * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n' +
                    ' *\n' +
                    ' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n' +
                    ' **/\n'
            },
            'js/Polaroid-Photo-Stack-min.js': ['js/Polaroid-Photo-Stack.js']
        },
        jshint: {
            all: [ 'js/Polaroid-Photo-Stack.js'],
            reporterOutput: './jshint-report.html'
        },
        clean: ['js/Polaroid-Photo-Stack-min.js'],
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', [ 'clean', 'analysis', 'package']);
    grunt.registerTask('analysis', [ 'jshint' ]);
    grunt.registerTask('package', [ 'uglify' ]);
    grunt.registerTask('compass', [ 'compass' ]);
};