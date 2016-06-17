'use strict'
import co from 'co'
import Koa from 'koa'
import logger from 'koa-logger'
import onerror from 'koa-onerror'
import ejs from 'koa-ejs'
import koaStatic from 'koa-static'
import convert from 'koa-convert'
import path from 'path'
import compress from 'koa-compress'
import favicon from 'koa-favicon'
import body from 'koa-better-body'
import bodyParser from 'koa-bodyparser'
import session from 'koa-session2'
import webpack from 'webpack'
import devMiddleware from 'koa-webpack-dev-middleware'
import hotMiddleware from 'koa-webpack-hot-middleware'

import config from './config'

let Store = config.store

const app = new Koa()
// 开发环境热重启
if (process.env.NODE_ENV === 'development') {
    const webpackConfig = require('../bulid/webpack.dev.config')
    const compiler = webpack(webpackConfig)

    app.use(convert(devMiddleware(compiler, {
        noInfo: false,
        quiet: false,
        hot: true,
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true,
            chunks: false
        }
    })))
    app.use(convert(hotMiddleware(compiler)))
}
// 路由
const router = config.router()

// 错误处理
app.on('error', (err, ctx) => {
    console.log(err)
    console.log(1)
})
onerror(app)

// 静态模板
app.use(convert((koaStatic(path.join(__dirname, 'public')))))
app.use(favicon(`${__dirname}/public/static/favicon.ico`))

ejs(app, {
    root: path.join(__dirname, 'views/pages'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
})

app.use(async (ctx, next) => {
    ctx.render = co.wrap(ctx.render)
    await next()
})
// 使用日志中间件
app.use(convert(logger()))
// compress中间件,压缩静态文件
app.use(compress())
// session
app.use(session({
    key: 'SESSIONID',
    store: new Store(),
    maxAge: new Date(60 * 60 * 1000)
}))
// request
// request
app.use(convert(body()))
// 路由中间件
app
  .use(router.routes())
  .use(router.allowedMethods())
export { app }
