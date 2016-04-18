import runSequence from 'gulp-sequence'
export default (gulp) => {
    gulp.task('client_pro', (cb) => {
        runSequence('client_del', 'copy_static', ['webpack_pro'], cb)
    })
}
