import del from 'del'
import rename from 'gulp-rename'
import gutil from 'gulp-util'
import nodemon from 'gulp-nodemon'
import runSequence from 'gulp-sequence'
import webpack from 'webpack'

import eslint from 'gulp-eslint'
import eslint_formatter from 'eslint-friendly-formatter'
export default (_opt) => {
    const gulp = _opt.gulp

    const webpackConfigDev = _opt.webpack.dev,
        webpackConfigPro = _opt.webpack.pro

    const server = _opt.path.server
    const client = _opt.path.client
    const assets = _opt.path.assets

    /**
     * webpack开发任务
     * @param  {[type]} 'webpack_dev' [description]
     * @param  {[type]} (             [description]
     * @return {[type]}               [description]
     */
    gulp.task('webpack_dev', () => {

        webpack(webpackConfigDev, (err, stats) => {
            if (err) throw new gutil.PlugingError('webpack',
                err)
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n')
        })
    })

    gulp.task('webpack_pro', () => {

        webpack(webpackConfigPro, (err, stats) => {
            if (err) throw new gutil.PlugingError('webpack',
                err)
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n')
        })
    })

    /**
     * 清空静态文件
     * @param  {[type]} 'client_dev' [description]
     * @param  {[type]} (            [description]
     * @return {[type]}              [description]
     */
    gulp.task('client_del', () => {
        del([assets + '/public/img/**/*'])
        del([assets + '/public/css/**/*'])
        del([assets + '/public/js/**/*'])
        del([assets + '/public/font/**/*'])
        del([assets + '/views/pages/**/*'])
    })

    // html任务
    gulp.task('copy_static', () => {
        return gulp.src(client + '/static/**/*')
            .pipe(rename((file_path) => {
                // file_path.dirname = file_path.dirname.replace(
                //     /\/static\/image/, '');
            }))
            .pipe(gulp.dest(assets + '/public/static'))
    })


    gulp.task('client_watch', () => {
        gulp.watch(client + '/static/**/*', ['copy_static'])
        gulp.watch(client + '/*.html', ['webpack_dev'])
        gulp.watch(client + '/**/*.js', ['webpack_dev'])
        gulp.watch(client + '/**/*.vue', ['webpack_dev'])
    })
}
