'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var glob = require('glob');
var path = require('path');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Hint Javascript
gulp.task('jshint', function () {
    return gulp.src([
            'app/assets/scripts/**/*.js',
            '!app/assets/scripts/vendor/**/*.js'
        ])
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// // Optimize Images
// gulp.task('images', function () {
//     return gulp.src([
//             'app/images/**/*'
//         ])
//         .pipe($.if('!**/*.svg', $.cache(
//             $.imagemin({
//                 progressive: true,
//                 interlaced: true
//             })
//         )))
//         .pipe(gulp.dest('dist/images'))
//         .pipe($.size({title: 'images'}));
// });

// Process SVG
gulp.task('svg', function() {
    return gulp.src('app/assets/images/svg/src/**/*.svg')
        .pipe($.svgmin())
        .pipe(gulp.dest('app/assets/images/svg/min'))
        .pipe($.svgstore({
            fileName: 'sprite.svg',
            prefix: 'icon-',
            inlineSvg: true,
            transformSvg: function($svg, done) {
                $svg.find('[fill]').removeAttr('fill');
                done(null, $svg);
            }
        }))
        .pipe(gulp.dest('app/assets/images/svg/sprite'));
});

// // Copy web fonts to dist
// gulp.task('fonts', function () {
//     return gulp.src(['app/fonts/**'])
//         .pipe(gulp.dest('dist/fonts'))
//         .pipe($.size({title: 'fonts'}));
// });

// // Copy all files at the root level (app)
// gulp.task('copy', function () {

//     var html = gulp.src([
//             'app/*',
//             '!app/*.html'
//         ])
//         .pipe(gulp.dest('dist'));
    
//     var vendor = gulp.src('app/js/vendor/*')
//         .pipe(gulp.dest('dist/js/vendor'));
        
//     var ajax = gulp.src('app/ajax/*')
//             .pipe(gulp.dest('dist/ajax'))
//             .pipe($.size({title: 'copy'}));
            
//     return merge(html, vendor, ajax);
// });

gulp.task('copy:styles', function () {
    gulp.src([
        'app/assets/styles/*',
        '!app/assets/styles/scss'
    ])
    .pipe(gulp.dest('dist/styles'))
    .pipe(gulp.dest('../www/css/'));
});

gulp.task('copy:images', function () {
    gulp.src([
        'app/assets/images/**/*'
    ])
    .pipe(gulp.dest('dist/images'));
});

gulp.task('copy:scripts', function () {
    gulp.src([
        'app/assets/scripts/**/*'
    ])
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('copy:fonts', function () {
    gulp.src([
        'app/assets/fonts/**/*'
    ])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('styles', function () {
    return gulp.src('app/assets/scss/*.scss')
        .pipe($.sass({
            outputStyle: 'compressed',
            errLogToConsole: false,
            onError: function(err) {
                return console.log(err);
            }
        }))
        .pipe($.autoprefixer({
            browsers: ['last 3 versions', 'ie >= 9']
        }))
        .pipe(gulp.dest('app/assets/styles'));
});

// // Scan HTML for assets and optimize them
// gulp.task('html', function () {
//     return gulp.src('app/**/*.html')
//         .pipe($.useref.assets({searchPath: 'app'}))
//         // Minify javascript
//         .pipe($.if([
//             'scripts/*.js',
//             '!scripts/{vendor,vendor/**/*}.js'
//         ], $.uglify({preserveComments: 'some'})))
//         // Minify styles
//         .pipe($.if('*.css', $.csso()))
//         .pipe($.useref.restore())
//         // Concatenate styles
//         .pipe($.useref())
//         // Output Files
//         .pipe(gulp.dest('dist'))
//         .pipe($.size({title: 'html'}));
// });

gulp.task('layout', function () {
    return gulp.src(['app/html/*.html', '!app/html/layout.html'])
        .pipe($.wrap({src: 'app/html/layout.html'}))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('layout:dist', function () {
    return gulp.src(['app/html/*.html', '!app/html/layout.html'])
        .pipe($.wrap({src: 'app/html/layout.html'}))
        .pipe(gulp.dest('dist'));
});

// Clean dist directory
gulp.task('clean', del.bind(null, ['dist']));
gulp.task('clean:tmp', del.bind(null, ['.tmp']));

// Serve app directory
gulp.task('serve', function () {
    runSequence('clean:tmp', ['layout', 'watch']);
    browserSync({
        notify: false,
        ghostMode: false,
        server: {
            baseDir: ['.tmp', 'app/assets']
        }
    });
});

// Build and serve the dist build
gulp.task('serve:dist', ['default'], function () {
    browserSync({
        notify: false,
        server: {
            baseDir: 'dist'
        }
    });
});

// Watch Files For Changes & Reload
gulp.task('watch', function() {
    gulp.watch(['app/html/*.html'], ['layout', reload]);
    gulp.watch(['app/assets/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/assets/scss/**/*.scss'], ['styles']);
    gulp.watch(['app/assets/styles/**/*.css'], reload);
    // gulp.watch(['app/images/**/*'], reload);
    gulp.watch(['app/assets/images/svg/src/**/*.svg'], ['svg']);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
    runSequence('styles', 'svg', ['layout:dist', 'copy:styles', 'copy:scripts', 'copy:images', 'copy:fonts'], cb);
});