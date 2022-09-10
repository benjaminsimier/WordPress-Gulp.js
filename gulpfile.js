var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));

var autoprefixer = require('gulp-autoprefixer');

var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var babel = require('gulp-babel');

var rename = require('gulp-rename');

var livereload = require('gulp-livereload');

var autoprefixBrowsers = [
  '> 1%', 
  'last 2 versions', 
  'firefox >= 4', 
  'safari 7', 'safari 8', 
  'IE 8', 'IE 9', 'IE 10', 'IE 11'
];
 
// SASS + MIN CSS
gulp.task('sass', function() {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ 
      overrideBrowserslist: autoprefixBrowsers 
    }))
    .pipe(gulp.dest('./'))

    .pipe(cleanCSS({
      compatibility: 'ie8',
      level: {
        1: {
          specialComments: 0
        }
      }
    }))
    .pipe(rename({ suffix: '.min' }))

    .pipe(gulp.dest('./'))

    .pipe(livereload());
});

// MIN JAVASCRIPT 
gulp.task('js', function() {
  return gulp.src('./js/!(*.min)*.js')
  // return gulp.src('./js/app.js')

    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/js'))

    .pipe(livereload({
      // basePath: './dist/js/app.min.js'
    }));
});

// PHP
gulp.task('php', function() {
  return gulp.src('./**/*.php')
  .pipe(livereload())
});

// WATCH
gulp.task('watch', function() {
  gulp.watch('./**/*.php', gulp.series('php'));
  gulp.watch('./sass/**/*.scss', gulp.series('sass'));
  gulp.watch('./js/!(*.min)*.js', gulp.series('js'));
  livereload.listen({
    // port: 3005 // You can change the port here
  });
});