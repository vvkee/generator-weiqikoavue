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

import config from './config'


const app = new Koa()

// 错误处理
app.on('error', (err, ctx) => {
    console.log(err)

    log.error('server error', err, ctx);
})
onerror(app)

// 静态模板
app.use(convert((koaStatic(path.join(__dirname, 'public')))))
app.use(favicon(__dirname + '/public/static/favicon.ico'))

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

// 路由中间件
app
  .use(config.router.routes())
  .use(config.router.allowedMethods())
console.log('app000', app)
export { app }
