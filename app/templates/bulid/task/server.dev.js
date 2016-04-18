import runSequence from 'gulp-sequence'
export default (gulp) => {
    gulp.task('server_dev', (cb) => {
        runSequence('server_clean', ['server_eslint', 'server_copy'],
            'server', 'server_watch', cb)
    })
}
