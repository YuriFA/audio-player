const gulp = require('gulp')
const browserify = require('gulp-browserify')

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
