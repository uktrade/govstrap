const gulp = require('gulp');
const babel = require('gulp-babel');
const paths = require('../paths');


gulp.task('babel', () => {
  return gulp.src(paths.sourceJS + '/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});
