const rename = require('gulp-rename');
const gulp = require('gulp');
const removeFiles = require('gulp-remove-files');

const filePath = './dist/highcharts-files/';

gulp.task('default', async function () {
    
    // rename
    gulp.src(filePath + '*.js')
        .pipe(rename(function (path) {
            path.extname = '.hcscript';
        }))
        .pipe(gulp.dest(filePath));
    
    // remove duplicates
    gulp.src(filePath + '*.js')
        .pipe(removeFiles());

    // rename modules
    gulp.src(filePath + 'modules/*.js')
        .pipe(rename(function (path) {
            path.extname = ".hcscript";
        }))
        .pipe(gulp.dest(filePath + 'modules/'));

    // remove duplicates of modules
    gulp.src(filePath + 'modules/*.js')
        .pipe(removeFiles());

});