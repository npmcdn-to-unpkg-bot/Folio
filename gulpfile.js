"use strict";

var gulp = require("gulp"),
		sass = require("gulp-sass"),
		plumber = require("gulp-plumber"),
		postcss = require("gulp-postcss"),
		autoprefixer = require("autoprefixer"),
		rename = require("gulp-rename"),
		imagemin = require("gulp-imagemin"),
		// combineMq = require("gulp-combine-mq"),
		uglify = require('gulp-uglify'),
		concat = require('gulp-concat'),
		minifyCss = require('gulp-minify-css'),
		rimraf = require('rimraf'),
		jade = require('gulp-jade'),
		browserSync = require('browser-sync').create();

// var scriptList = [
// 	'source/js/common.js'
// ]

gulp.task("build",["style", "images", "script", "jade"]);

gulp.task("style", function() {
	return gulp.src("sass/style.{sass,scss}")
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'expanded'
		})).on('error', sass.logError)
		.pipe(postcss([
			autoprefixer({browsers: "last 2 versions"})
		]))
		// .pipe(combineMq({
		// 	beautify: false
		// }))
		.pipe(minifyCss())
		.pipe(rename({
				suffix: ".min"
		}))
		.pipe(gulp.dest("css"))
		.pipe(browserSync.stream());
});

gulp.task("images", function() {
	return gulp.src("source/img/*.{png,jpg,gif,svg}")
		.pipe(imagemin())
		.pipe(gulp.dest("build/img"));
});

gulp.task('script', function() {
	return gulp.src(scriptList)
		.pipe(concat('script.js'))
		.pipe(gulp.dest('./build/js/'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('clean', function (cb) {
return rimraf('build', cb);
});


gulp.task("jade", function() {

	return gulp.src('./jade/*.jade')
		.pipe(plumber())
		.pipe(jade())
		.pipe(gulp.dest('./'))
});

// Static Server + watching scss/html files
gulp.task('server', ['style', 'jade'], function() {

		browserSync.init({
				server: "./",
				open: false
		});

		gulp.watch("sass/*.scss", ['style']);
		gulp.watch("sass/**/*.scss", ['style']);
		gulp.watch("jade/*.jade", ['jade']);
		gulp.watch("js/*.js", ['script']);
		gulp.watch("*.html").on('change', browserSync.reload);
});
