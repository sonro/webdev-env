var gulp    = require('gulp'),
    sass    = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    bSync   = require('browser-sync'),
    del     = require('del'),
    gSync   = require('gulp-sync')(gulp);

gulp.task('default', ['serve', 'watch']);

gulp.task('clean', function() {
    return del(['./html/**/*']);
});

gulp.task('markup', function() {
    gulp.src('./src/**/*.php')
        .pipe(gulp.dest('./html'))
    
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./html'))

         bSync.reload();

});

gulp.task('styles', function() {
    gulp.src('./src/assets/scss/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./html/assets/css'))
        .pipe(bSync.reload({stream:true}));
});

gulp.task('scripts', function() {
    gulp.src('./src/assets/js/**/*.js')
        .pipe(plumber())
        .pipe(gulp.dest('./html/assets/js'));
});


gulp.task('serve', ['markup', 'styles', 'scripts'], function() {
    bSync.init({
        open: false,
        host: 'localhost',
        proxy: 'localhost',
        // port: 80
        // server: {
        //     basedir: "html"
        // }
    });
});

gulp.task('reload', function() {
    bSync.reload();
});

gulp.task('watch', function() {
    // html/php files
    gulp.watch('./src/**/*.html', ['markup']); 
    gulp.watch('./src/**/*.php', ['markup']);

    // sass
    gulp.watch('./src/assets/scss/**/*.scss', ['styles']);

    // js
    gulp.watch('./src/assets/js/**/*.js', gSync.sync(['scripts', 'reload'], "script build"));
});
