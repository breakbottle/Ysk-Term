// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
var changed = require('gulp-changed');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var clip = require('gulp-clip-empty-files');
var lessSrc = './source/less/*.less';
//var outputDir './output';

gulp.task('manifest',function(){
  gulp.src('./source/*.json')
    .pipe(changed('./source/*.json'))
    .pipe(minifyHTML())
    .pipe(gulp.dest('./output'));
});


 // minify new or changed HTML pages
gulp.task('htmlfiles', function() {
  var htmlSrc = './source/html/*.html',
      htmlDst = './output';
 
  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src('./source/js/*.js')
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./output'));
});


gulp.task('less', function() {
  gulp.src(lessSrc)
  	.pipe(changed(lessSrc))
    //.pipe(foxy().transform())
    .pipe(less())
    .pipe(clip())
    .pipe(gulp.dest('./output'));
});

gulp.task('minifyCSS',function(){
	gulp.src('./output/*.css')
	.pipe(minifyCSS())
	.pipe(gulp.dest('./output'));
});

gulp.task('imagemin', function() {
  var imgSrc = './source/img/*',
      imgDst = './output';
 
  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});


gulp.task('default', ['manifest','htmlfiles','scripts','less','minifyCSS','imagemin'], function() {
  // watch for HTML changes
    gulp.watch('./source/html/*.html', ["htmlfiles"]);
    gulp.watch('./source/js/*.js', ["scripts"]);
    gulp.watch('./source/less/*.less', ["less"]);
    gulp.watch('./source/img/*', ["imagemin"]);
    gulp.watch('./source/*.json', ["manifest"]);
    gulp.watch('./output/*.css', ["minifyCSS"]);
});