import del from 'del'
import gutil from 'gulp-util'
import nodemon from 'gulp-nodemon'
import runSequence from 'gulp-sequence'

import eslint from 'gulp-eslint'
import eslint_formatter from 'eslint-friendly-formatter'

let app = null;

export default (_opt) => {
    let gulp = _opt.gulp

    const rootPath = _opt.path.root
    const server = _opt.path.server
    const client = _opt.path.client
    const assets = _opt.path.assets

    /**
     * server删除
     * @param  {[type]} 'server_clean' [description]
     * @param  {[type]} (              [description]
     * @return {[type]}                [description]
     */
    gulp.task('server_clean', () => {
        del([assets + '/config/**/*'])
        del([assets + '/controller/**/*'])
        del([assets + '/server/**/*'])
        del([assets + '/app.js'])
    })

    /**
     * js检验
     * @param  {[type]} 'server_eslint' [description]
     * @param  {[type]} (               [description]
     * @return {[type]}                 [description]
     */
    gulp.task('server_base', () => {
        return gulp.src(server + '/**/*.js')
            .pipe(eslint())
            .pipe(eslint.format(eslint_formatter))
            .pipe(gulp.dest(assets))
    })

    /**
     * 启动服务器
     * @param  {[type]} 'server' [description]
     * @param  {[type]} (        [description]
     * @return {[type]}          [description]
     */
    gulp.task('server', () => {
        app = nodemon({
            script: rootPath + '/bin/www',
            execMap: {
                "js": "node"
            },
            watch: [
                assets + '/app.js',
                assets + '/config',
                assets + '/controller',
                assets + '/middleware',
                assets + '/service',
                assets + '/util'
            ],
            env: {
                'NODE_ENV': 'development'
            }
        }).on('start', function() {
            gutil.log(gutil.colors.yellow(
                'http://localhost:3377'));
        })
        return app
    })

    /**
     * 监听server
     * @param  {[type]} 'server_watch' [description]
     * @param  {[type]} (              [description]
     * @return {[type]}                [description]
     */
    gulp.task('server_watch', () => {
        let watcher = gulp.watch(server + '/**/*', ['server_base'])
    })
}
