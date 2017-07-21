import gulp from 'gulp';
import uglify from 'gulp-uglify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import babel from 'babelify';
import errorHandler from '../utils/errorHandler';
import paths from '../paths';

gulp.task('scripts:compile', () => {
  const bundler = browserify(`${paths.src.scripts}/main.js`, { debug: true }).transform(babel);
  return bundler
    .bundle()
    .on('error', (err) => { console.error(err); this.emit('end'); })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.scripts));
});

gulp.task('scripts:copy', () => {
  gulp
    .src(`${paths.src.scripts}/vendor/*.js`)
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.dist.scripts}/vendor`));
});
