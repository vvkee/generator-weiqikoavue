import runSequence from 'gulp-sequence'
export default (gulp) => {
    gulp.task('client_pro', (cb) => {
        runSequence('client_del', 'copy', ['webpack_pro'], cb)
    })
}
