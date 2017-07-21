import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import sass from 'gulp-sass';
import prefix from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import paths from '../paths';

gulp.task('styles', () => {
  gulp.src(`${paths.src.styles}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix({
      browsers: ['last 15 versions'],
    }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.styles));
});
