/* eslint-disable */
const gulp = require('gulp');
const twig = require('gulp-twig');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const glob = require('gulp-sass-glob');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const browserSync = require('browser-sync');

gulp.task('twig', () => {
  return gulp
    .src('src/templates/*.twig')
    .pipe(twig())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});

/*need to gulp the img to dist assets */
gulp.task('images', function() {
  return gulp.src('assets/img/**/*.jpeg')
  .pipe(gulp.dest('dist/img'));
});

gulp.task('sass', () => {
  return gulp
    .src('assets/sass/**/*.scss')
    .pipe(glob())
    .pipe(
      sass({
        includePaths: ['./node_modules']
      })
    )
    // .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('dist'));
});

gulp.task('stylelint', () => {
  return gulp.src('assets/sass/**/*.scss').pipe(
    stylelint({
      reporters: [{ formatter: 'string', console: true }]
    })
  );
});

gulp.task('babel', () => {
  return gulp
    .src('assets/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('eslint', () => {
  return gulp
    .src(['assets/js/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});



gulp.task('browsersync', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('watch', function () {
	gulp.watch(
    ['src/templates/**/*.twig', 'assets/sass/**/*.scss', 'assets/js/*.js'],
    gulp.series('build', browserSync.reload)
  );
});



gulp.task('lint', gulp.parallel('stylelint', 'eslint'));
gulp.task('build', gulp.parallel('twig','sass', 'images', 'babel'));
gulp.task('server', gulp.series('build', gulp.parallel('browsersync','watch'))); //Need to watch after the build done and browsersync init to force reload on change
gulp.task('default', gulp.series('lint', 'build'));
