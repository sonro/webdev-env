var gulp    = require('gulp'),
    sass    = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    bSync   = require('browser-sync'),
    gSync   = require('gulp-sync')(gulp);

gulp.task('default', ['serve', 'watch']);

gulp.task('markup', function() {
    gulp.src('./src/*.php)
        .pipe(gulp.dest('./html/'));
    
    gulp.src('./src/*.html)
        .pipe(gulp.dest('./html/'));
});

gulp.task('styles', function() {
    gulp.src('./src/assets/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./html/assets/css/app.css')
        .pipe(bSync.reload({stream:true}));
});

gulp.task('scripts', function() {
    gulp.src('./src/assets/js/**/*.js')
        .pipe(gulp.dest('./html/assets/js');
});


gulp.task('serve', ['markup', 'styles', 'scripts'], function() {
    bSync.init({
        open: 'external',
        host: 'local.dev',
        proxy: 'local.dev',
        port: 80
        // server: {
        //     basedir: "./"
        // }
    });
});

gulp.task('watch' function() {
    // html/php files
    gulp.watch('./src/*.html', ['markup']); 
    gulp.watch('./src/*.php', ['markup']);

    // sass
    gulp.watch('./src/scss/**/*.scss', ['styles']);

    // js
    gulp.watch('./src/assets/js/**/*.js', gSync(['scripts', 'reload'], "script build"));
});
