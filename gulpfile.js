const gulp = require('gulp')
const browserify = require('gulp-browserify')
const webserver = require('gulp-webserver');
 
gulp.task('webserver', function() {
  gulp.src('./public')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('scripts', function () {
  gulp.src(['./src/js/app.js'])
    .pipe(browserify({
      transform: ['babelify']
    }))
    .pipe(gulp.dest('./public/js'))
})

gulp.task('watch', function () {
  gulp.watch('src/js/**/*.js', ['scripts'])
})

gulp.task('default', ['watch'])
