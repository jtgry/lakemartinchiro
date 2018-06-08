'use strict'

import gulp from 'gulp'
import del from 'del'
import runSequence from 'run-sequence'
import gulpLoadPlugins from 'gulp-load-plugins'
import { spawn } from "child_process"
import tildeImporter from 'node-sass-tilde-importer'

const $ = gulpLoadPlugins()
const browserSync = require('browser-sync').create()
const imageResize = require('gulp-image-resize');
const htmlmin = require('gulp-htmlmin');
const isProduction = process.env.NODE_ENV === 'production'

const onError = (err) => {
    console.log(err)
}

let suppressHugoErrors = false;

// --

gulp.task('server', ['build'], () => {
    gulp.start('init-watch')
    $.watch(['archetypes/**/*', 'data/**/*', 'content/**/*', 'layouts/**/*', 'static/**/*', 'config.toml'], () => gulp.start('hugo'))
});

gulp.task('server:with-drafts', ['build-preview'], () => {
    gulp.start('init-watch')
    $.watch(['archetypes/**/*', 'data/**/*', 'content/**/*', 'layouts/**/*', 'static/**/*', 'config.toml'], () => gulp.start('hugo-preview'))
});

gulp.task('init-watch', () => {
    suppressHugoErrors = true;
    browserSync.init({
        server: {
            baseDir: 'public'
        },
        open: false
    })
    $.watch('src/sass/**/*.scss', () => gulp.start('sass'))
    $.watch('src/js/**/*.js', () => gulp.start('js-watch'))
    $.watch('src/images/**/*', () => gulp.start('images'))  
})

gulp.task('build', () => {
    runSequence(['import-sass', 'sass', 'js', 'fonts', 'images', 'pub-delete'], ['images-resize-small', 'images-resize-medium', 'uploads-resize-small', 'uploads-resize-medium'], 'hugo')
})

gulp.task('build-preview', () => {
    runSequence(['import-sass', 'sass', 'js', 'fonts', 'images', 'pub-delete'], ['images-resize-small', 'images-resize-medium', 'uploads-resize-small', 'uploads-resize-medium'], 'hugo-preview')
})



gulp.task('hugo', (cb) => {
    let baseUrl = process.env.NODE_ENV === 'production' ? process.env.URL : process.env.DEPLOY_PRIME_URL;
    let args = baseUrl ? ['-b', baseUrl] : [];

    return spawn('hugo', args, { stdio: 'inherit' }).on('close', (code) => {
        if (suppressHugoErrors || code === 0) {
            browserSync.reload()
            cb()
        } else {
            console.log('hugo command failed.');
            cb('hugo command failed.');
        }
    })
})



gulp.task('hugo-preview', (cb) => {
    let args = ['--buildDrafts', '--buildFuture'];
    if (process.env.DEPLOY_PRIME_URL) {
        args.push('-b')
        args.push(process.env.DEPLOY_PRIME_URL)
    }
    return spawn('hugo', args, { stdio: 'inherit' }).on('close', (code) => {
        if (suppressHugoErrors || code === 0) {
            browserSync.reload()
            cb()
        } else {
            console.log('hugo command failed.');
            cb('hugo command failed.');
        }
    })
})

// --

gulp.task('import-sass', () => {
    return gulp.src([
        'node_modules/jeet/**'
    ])
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.print())
    .pipe(gulp.dest('src/sass/jeet'))
    .pipe(browserSync.stream())
})

gulp.task('sass', () => {
    return gulp.src([
        'src/sass/app.scss'
    ])
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.print())
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sass({ precision: 5, importer: tildeImporter }))
    .pipe($.autoprefixer(['ie >= 10', 'last 2 versions']))
    .pipe($.if(isProduction, $.cssnano({ discardUnused: false, minifyFontValues: false })))
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest('static/css'))
    .pipe(browserSync.stream())
})

gulp.task('js-watch', ['js'], (cb) => {
    browserSync.reload();
    cb();
});

gulp.task('js', () => {
    return gulp.src([
        'node_modules/scrollreveal/dist/scrollreveal.js',
        'src/js/vendor/*.js',
        'src/js/scripts.js'
    ])
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.print())
    .pipe($.concat('app.js'))
    .pipe($.if(isProduction, $.uglify()))
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest('static/js'))
})

gulp.task('fonts', () => {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('static/fonts'));
});

gulp.task('images', () => {
    return gulp.src('src/images/**/*.{png,jpg,jpeg,gif,svg,webp,ico}')
        .pipe($.newer('static/images'))
        .pipe($.print())
        .pipe(gulp.dest('static/images'));
});

gulp.task('images-resize-small', () => {
    return gulp.src('static/images/**/*.{png,jpg,jpeg}')
        .pipe($.newer('static/images-resized/small/images'))
        .pipe($.print())
        .pipe($.imageResize({
        width : 500,
        upscale : false
        }))
        .pipe(gulp.dest('static/images-resized/small/images'));
});

gulp.task('images-resize-medium', () => {
return gulp.src('static/images/**/*.{png,jpg,jpeg}')
    .pipe($.newer('static/images-resized/medium/images'))
    .pipe($.print())
    .pipe($.imageResize({
    width : 1000,
    upscale : false
    }))
    .pipe(gulp.dest('static/images-resized/medium/images'));
});

gulp.task('uploads-resize-small', () => {
    return gulp.src('static/uploads/**/*.{png,jpg,jpeg}')
        .pipe($.newer('static/images-resized/small/uploads'))
        .pipe($.print())
        .pipe($.imageResize({
        width : 500,
        upscale : false
        }))
        .pipe(gulp.dest('static/images-resized/small/uploads'));
    });
    
gulp.task('uploads-resize-medium', () => {
    return gulp.src('static/uploads/**/*.{png,jpg,jpeg}')
        .pipe($.newer('static/images-resized/medium/uploads'))
        .pipe($.print())
        .pipe($.imageResize({
        width : 1000,
        upscale : false
        }))
        .pipe(gulp.dest('static/images-resized/medium/uploads'));
});

gulp.task('minify', function() {
    return gulp.src('public/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('public'));
});

gulp.task('cms-delete', () => {
    return del(['static/admin'], { dot: true })
})

gulp.task('pub-delete', () => {
    return del(['public/**', '!public'], {
      // dryRun: true,
      dot: true
    }).then(paths => {
      console.log('Files and folders deleted:\n', paths.join('\n'), '\nTotal Files Deleted: ' + paths.length + '\n');
    })
})
