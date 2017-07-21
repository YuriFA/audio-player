import gulp from 'gulp';
import plumber from 'gulp-plumber';
import prettify from 'gulp-html-prettify';
import errorHandler from '../utils/errorHandler';
import paths from '../paths';

gulp.task('markup', () => {
  gulp
    .src(`${paths.baseSrc}/**/*.html`)
    .pipe(plumber({ errorHandler }))
    .pipe(prettify({
      brace_style: 'expand',
      indent_size: 1,
      indent_char: '\t',
      indent_inner_html: true,
      preserve_newlines: true,
    }))
    .pipe(gulp.dest(paths.baseDist));
});
