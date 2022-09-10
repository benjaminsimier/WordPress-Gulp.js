const gulp = require('gulp');

// SCSS + CSS
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// JS minifie
const uglify = require('gulp-uglify');

// Rename
const rename = require('gulp-rename');

// Serve reload
const livereload = require('gulp-livereload');

// Image optimize
const image = require('gulp-image');

// Cache
const cache = require('gulp-cached');

var autoprefixBrowsers = [
  '> 1%', 
  'last 2 versions', 
  'firefox >= 4', 
  'safari 7', 'safari 8', 
  'IE 8', 'IE 9', 'IE 10', 'IE 11'
];

// IMAGES
gulp.task('image', async function() {
    gulp.src('./sources/images/**/*')
    .pipe(cache(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      concurrent: 10,
      quiet: true
    })))
    .pipe(gulp.dest('./build/images'));
});

// SASS + MIN CSS
gulp.task('sass', function() {
  return gulp.src('./sources/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ 
      overrideBrowserslist: autoprefixBrowsers 
    }))
    .pipe(gulp.dest('./build/styles'))

    .pipe(cleanCSS({
      compatibility: 'ie8',
      level: {
        1: {
          specialComments: 0
        }
      }
    }))
    .pipe(rename({ suffix: '.min' }))

    .pipe(gulp.dest('./build/styles'))

    .pipe(livereload());
});

// MIN JAVASCRIPT 
gulp.task('js', function() {
  return gulp.src('./sources/js/!(*.min)*.js')

    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./build/js'))

    .pipe(livereload());
});

// PHP
gulp.task('php', function() {
  return gulp.src('./**/*.php')
  .pipe(livereload())
});

// WATCH
gulp.task('watch', function() {
  gulp.watch('./**/*.php', gulp.series('php'));
  gulp.watch('./sources/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('./sources/js/!(*.min)*.js', gulp.series('js'));
  gulp.watch('./sources/images/**/*', gulp.series('image'));
  livereload.listen({
    quiet: true
  });
});