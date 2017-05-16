var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    ftp     = require('vinyl-ftp'),
    sass    = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    bSync   = require('browser-sync'),
    del     = require('del'),
    gSync   = require('gulp-sync')(gulp);

gulp.task('default', ['serve', 'watch']);


var user = process.env.FTP_USER;  
var password = process.env.FTP_PWD;  
var host = 'files.000webhost.com';
var port = 21; 
var localFilesGlob = ['public_html/**/*'];  
var remoteFolder = '/public_html';

function getFtpConnection() {  
    return ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        parallel: 1,
        log: gutil.log
    });
}

/**
 * Deploy task
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-upload`
 */
gulp.task('ftp-upload', function() {

    var conn = getFtpConnection();

    return gulp.src(localFilesGlob, { base: './public_html', buffer: false })
        // .pipe( conn.newer( remoteFolder ) ) // only upload newer files 
        .pipe( conn.dest( remoteFolder ) );
});

gulp.task('publish', function() {
    gulp.src('./src/**/*.php')
        .pipe(gulp.dest('./public_html'))
    
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./public_html'))

    gulp.src('./src/assets/data/**/*')
        .pipe(gulp.dest('./public_html/assets/data'));

    gulp.src('./src/assets/scss/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public_html/assets/css'))

    gulp.src('./src/assets/js/**/*.js')
        .pipe(plumber())
        .pipe(gulp.dest('./public_html/assets/js'));
});

gulp.task('deploy', gSync.sync(['publish', 'ftp-upload'], "Deploying"));

gulp.task('clean', function() {
    return del(['./html/**/*']);
});

gulp.task('clean-pub', function() {
    return del(['./public_html/**/*']);
});

gulp.task('markup', function() {
    gulp.src('./src/**/*.php')
        .pipe(gulp.dest('./html'))
    
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./html'))

         bSync.reload();

});

gulp.task('data', function() {
    gulp.src('./src/assets/data/**/*')
        .pipe(gulp.dest('./html/assets/data'));
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


gulp.task('serve', ['markup', 'data', 'styles', 'scripts'], function() {
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

    // data files
    gulp.watch('./src/assets/data/**/*', ['data']);

    // sass
    gulp.watch('./src/assets/scss/**/*.scss', ['styles']);

    // js
    gulp.watch('./src/assets/js/**/*.js', gSync.sync(['scripts', 'reload'], "script build"));
});
