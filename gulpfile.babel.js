import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import flatten from "gulp-flatten";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import print from "gulp-print";
import sass from "gulp-sass";
import sassLint from "gulp-sass-lint";
import tildeImporter from "node-sass-tilde-importer";
import autoprefixer from "gulp-autoprefixer";
import size from "gulp-size";
import newer from "gulp-newer";
import googleWebFonts from "gulp-google-webfonts";
import htmlmin from "gulp-htmlmin";
import runSequence from 'run-sequence'

const browserSync = BrowserSync.create();

var options = { };

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Run server tasks
gulp.task("server", () => {
  runSequence(["hugo", "sass", "js", "google-fonts", "images"], ["minify", "fonts"], (cb) => runServer(cb));
}) 
gulp.task("server-preview", () => {
  runSequence(["hugo-preview", "sass", "js", "google-fonts", "images"], ["minify", "fonts"], (cb) => runServer(cb));
}) 
// Build/production tasks
gulp.task("build", () => {
  runSequence(["sass", "js", "google-fonts", "images"], ["minify", "fonts"], "hugo");
}) 
gulp.task("build-preview", () => {
  runSequence(["sass", "js", "google-fonts", "images"], ["minify", "fonts"], "hugo-preview");
}) 
// Compile CSS with PostCSS
gulp.task("css", () => (
  gulp.src("./src/css/*.css")
    .pipe(postcss([cssImport({from: "./src/css/main.css"}), cssnext()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

gulp.task('sass', () => {
  gulp.src("./src/sass/style.scss")
  .pipe(newer('./site/static/css'))
  .pipe(print())
  .pipe(sassLint())
  .pipe(sassLint.format())
  .pipe(sass({ precision: 5, importer: tildeImporter }))
  .pipe(autoprefixer(['ie >= 10', 'last 2 versions']))
  .pipe(size({ gzip: true, showFiles: true }))
  .pipe(gulp.dest('./site/static/css'))
  .pipe(browserSync.stream())
});

gulp.task('images', () => {
  gulp.src('src/images/**/*.{png,jpg,jpeg,gif,svg,webp,ico}')
  .pipe(newer('./site/static/images'))
  .pipe(print())
  .pipe(gulp.dest('./site/static/images'))
  .pipe(browserSync.stream())
});

// Compile Javascript
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

// Download Google Fonts
gulp.task('google-fonts', () => (
  gulp.src('./fonts.list')
    .pipe(googleWebFonts(options))
    .pipe(gulp.dest('./src/fonts/'))
));

// Move all fonts in a flattened directory
gulp.task('fonts', () => (
  gulp.src("./src/fonts/**/*")
    .pipe(flatten())
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(browserSync.stream())
));

// Minify HTML
gulp.task('minify', () => (
  gulp.src('./dist/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('./dist'))
));

// Development server with browsersync
function runServer() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./src/sass/**/*.scss", ["sass"]);
  gulp.watch("./src/fonts/**/*", ["fonts"]);
  gulp.watch("./src/images/**/*", ["images"]);
  gulp.watch("./site/**/*", ["hugo"]);
};

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
