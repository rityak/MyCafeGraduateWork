const gulp = require('gulp');
const babel = require("gulp-babel");
const minify = require('gulp-minify');
const clean = require('gulp-clean');


// gulp.task("javascript", function () {
//     gulp.src('public/javascripts/*', {read: false}).pipe(clean());
//     return gulp.src("public/ES6/*.js")
//         .pipe(babel())
//         .pipe(minify({
//             ext:{
//                 src:'-debug.js',
//                 min:'.js'
//             }
//         }))
//         .pipe(gulp.dest("public/javascripts/"));
// });

gulp.task("default", function () {
    gulp.watch("public/ES6/*.js", function (callback) {
        gulp.src('public/javascripts/*', {read: false}).pipe(clean());
        return gulp.src("public/ES6/*.js")
            .pipe(babel())
            .pipe(minify({
                ext:{
                    src:'-debug.js',
                    min:'.js'
                }
            }))
            .pipe(gulp.dest("public/javascripts/"));
    });
});
