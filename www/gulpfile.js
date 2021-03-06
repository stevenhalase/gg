// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/controllers/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/controllers/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('depscripts', function() {
    return gulp.src('js/dep/*.js')
        .pipe(concat('dep.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('dep.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function() {
    return gulp.src('css/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('depcss', function() {
    return gulp.src('css/dep/*.css')
    .pipe(concat('dep.css'))
    .pipe(gulp.dest('dist/css'))
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'depscripts', 'css', 'depcss']);
