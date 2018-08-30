var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    svgSprite = require('gulp-svg-sprites'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');

gulp.task('svg-sprite', function() {
    return gulp.src("app/img/svg/**/*.svg")
        // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill and style declarations in out shapes
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('[style]').removeAttr('style');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        // cheerio plugin create unnecessary string '>', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: "symbols",
            preview: false,
            selector: "icon-%f",
            svg: {
                symbols: 'symbol_sprite.html'
            }
        }))
        .pipe(gulp.dest("app/img/icon/"));
});

gulp.task('scss', function() {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        ghostMode: false
    });
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('app/sass/**/*.scss', ['scss']);
    gulp.watch('app/*html', browserSync.reload);
    gulp.watch('app/js/*js', browserSync.reload);
});