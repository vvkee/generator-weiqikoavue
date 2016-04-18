import runSequence from 'gulp-sequence'
export default (gulp) => {
    gulp.task('server_pro', (cb) => {
        runSequence('server_clean', ['server_eslint', 'server_copy'],
            cb)
    })
}
