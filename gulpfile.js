'use strict';

var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    clear   = require('clear'),
    mocha   = require('gulp-mocha'),
    jshint  = require('gulp-jshint');

gulp.task('lint', function () {
    gulp.src(['*.js', 'lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function () {
    gulp.src('test.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', gutil.log);
});

gulp.task('default', ['lint', 'test']);

gulp.task('dev', function() {
    gulp.watch('*.js', ['lint', 'test'], function(event) {
        clear();
        gutil.log(gutil.colors.cyan(event.path.replace(process.cwd(), '')) + ' ' + event.type + '. (' + gutil.colors.magenta(gutil.date('HH:MM:ss')) + ')');
    });
});