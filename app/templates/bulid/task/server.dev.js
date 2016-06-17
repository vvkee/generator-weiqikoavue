import runSequence from 'gulp-sequence'
export default (gulp) => {
    gulp.task('server_dev', (cb) => {
        runSequence('server_clean', 'server_base',
            'server', 'server_watch', cb)
    })
}
