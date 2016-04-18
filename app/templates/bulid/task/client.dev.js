import runSequence from 'gulp-sequence'
export default (gulp) => {
    gulp.task('client_dev', (cb) => {
        runSequence('client_del', 'copy_static', ['webpack_dev'], 'client_watch', cb)
    })
}
