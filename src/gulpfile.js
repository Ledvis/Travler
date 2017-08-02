var gulp = require("gulp");
var clean = require("del");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var run = require("run-sequence");
var server = require("browser-sync").create();

gulp.task("clean", function() {
  return clean(["../build"], {force: true});
});

gulp.task("copy", function() {
  return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "img/**",
      "js/**",
      "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("../build"));
});

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          "last 2 version"
        ]
      }),
      mqpacker({
        sort: false
      })
    ]))
    .pipe(gulp.dest("../build/css"))
    .pipe(minify({
      restructure: false,
      debug: true
    }))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("../build/css"))
    .pipe(server.stream());
});

gulp.task("html", function() {
  return gulp.src([
      "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("../build"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("../build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true })
    ]))
    .pipe(gulp.dest("../build/img"));
});

gulp.task("symbols", function() {
  return gulp.src("../build/img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("../build/img"));
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "symbols",
    fn
  );
});

gulp.task("serve", function() {
  server.init({
    server: "../build",
    notify: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html"]);
});
