var del = require("del");
var gulp = require("gulp");
var ghPages = require("gulp-gh-pages");
var nodemon = require("gulp-nodemon");
var processMaps = require("./process-maps.js");

var SRC_PATH = "./src/";
var DIST_PATH = "./dist/";

gulp.task("deploy", ["build"], function () {
  return gulp.src("./dist/**/*").pipe(ghPages());
});

gulp.task("build", ["maps"], function () {
  var filesToCopy = [
    "css/*",
    "images/*",
    "index.html",
    "js/**/*",
    "sounds/*"
  ];

  return gulp.src(filesToCopy, { cwd: SRC_PATH + "/**" }).pipe(gulp.dest(DIST_PATH));
});

gulp.task("clean", function () {
  return del(DIST_PATH);
});

gulp.task("server", ["build"], function () {
  return nodemon({
    script: "server.js",
    ext: "js html css",
    watch: [SRC_PATH],
    ignore: ["src/maps", DIST_PATH],
    tasks: ["build"]
  }).on("restart", function () {
    console.log("restarted!");
  });
});

gulp.task("maps", ["clean"], function () {
  gulp.src("maps/map*.txt", { cwd: SRC_PATH })
    .pipe(processMaps())
    .pipe(gulp.dest(DIST_PATH + "map/load/"));
});
