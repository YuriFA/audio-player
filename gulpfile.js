"use strict";

const gulp = require('gulp');
const browserify = require('gulp-browserify');
const webserver = require('gulp-webserver');
const sass = require('gulp-sass');
 
gulp.task('webserver', () => {
  gulp.src('./public')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('styles', () => {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('scripts', () => {
  gulp.src(['./src/js/app.js'])
    .pipe(browserify({
      transform: ['babelify']
    }))
    .pipe(gulp.dest('./public/js'))
});

gulp.task('watch', () => {
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/sass/**/*.scss', ['styles']);
});

gulp.task('default', ['watch']);
