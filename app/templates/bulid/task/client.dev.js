import runSequence from 'gulp-sequence'
export default (gulp) => {
    gulp.task('client_dev', (cb) => {
        runSequence('client_del', 'copy', 'client_watch', cb)
    })
}
