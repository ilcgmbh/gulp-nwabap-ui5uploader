'use strict';

var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    clear   = require('clear'),
    mocha   = require('gulp-mocha'),
    jshint  = require('gulp-jshint'),
    eslint  = require('gulp-eslint');

gulp.task('eslint', function () {
    gulp.src(['*.js', 'test/*.js', 'lib/*.js'])
        .pipe(eslint())
        .pipe(eslint.format('stylish'));
});

gulp.task('jshint', function () {
    gulp.src(['*.js', 'test/*.js', 'lib/*.js'])
     .pipe(jshint())
     .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint', ['eslint', 'jshint']);

gulp.task('test', function () {
    gulp.src('test/*.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', gutil.log);
});

gulp.task('default', ['lint', 'test']);

gulp.task('dev', function() {
    gulp.watch(['**/*.js', '!node_modules/**'], ['lint', 'test'], function(event) {
        clear();
        gutil.log(gutil.colors.cyan(event.path.replace(process.cwd(), '')) + ' ' + event.type + '. (' + gutil.colors.magenta(gutil.date('HH:MM:ss')) + ')');
    });
});
