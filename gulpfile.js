var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    cssnano = require('gulp-cssnano'),
    gulpIf = require('gulp-if'),
    browserSync = require('browser-sync').create(),
    cp = require('child_process');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

// Build Jekyll Site
gulp.task('jekyll-build', function(done){
  return cp.spawn(jekyll, ['build'], {stdio: 'inherit'}).on('close', done);
});

// Re-build Jekyll Site
gulp.task('jekyll-rebuild', ['jekyll-build'], function(){
  browserSync.reload();
});

// Compile SASS to CSS
gulp.task('sass', function(){
  return sass('assets/css/main.sass')
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('_site/assets/css/'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css/'));
});

// Serve files
gulp.task('serve', ['jekyll-build', 'sass'], function(){
  browserSync.init({
    server : '_site/'
  });
});

// Watch for file changes
gulp.task('watch', function(){
  gulp.watch(['assets/css/**/*.sass', 'assets/css/**/*.scss'], ['sass']);
  gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', '_posts/*'], ['jekyll-rebuild']);
});

// Gulp's default task
gulp.task('default', ['serve', 'watch']);
