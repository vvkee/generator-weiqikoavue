'use strict';
import gulp from 'gulp'
import runSequence from 'gulp-sequence'
import webpackConfigDev from './webpack.dev.config'
import webpackConfigPro from './webpack.pro.config'

import path from 'path'

const rootPath = path.join(process.cwd(), '..')
const server = path.join(process.cwd(), '..', '/src/server')
const client = path.join(process.cwd(), '..', '/src/client')
const assets = path.join(process.cwd(), '..', '/assets')

import task from './task'

task({
    gulp: gulp,
    path: {
        server: server,
        client: client,
        assets: assets,
        root: rootPath
    },
    webpack: {
        dev: webpackConfigDev,
        pro: webpackConfigPro
    }
})

/**
 * 开发环境
 * @param  {[type]} 'default' [description]
 * @param  {[type]} (cb       [description]
 * @return {[type]}           [description]
 */
gulp.task('dev', (cb) => {
    runSequence(['server_dev', 'client_dev'], cb)
})


/**
 * 编译环境
 * @param  {[type]} 'pro' [description]
 * @param  {[type]} (cb   [description]
 * @return {[type]}       [description]
 */
gulp.task('pro', (cb) => {
    runSequence(['server_pro', 'client_pro'], cb)
});


export default gulp
