import gulp from 'gulp';
import paths from '../paths';

gulp.task('static', () => {
  gulp
    .src(`${paths.src.static}/**/*`)
    .pipe(gulp.dest(paths.baseDist));
});
