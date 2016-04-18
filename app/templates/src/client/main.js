import Vue from 'vue'

import Router from 'vue-router'
import confRouter from './config/router'

import App from './app'

// 实例化Vue
const vm = new Vue({
    el: 'body'
})

// vue使用router
Vue.use(Router)

// 实例化路由
const router = new Router()

// 路由配置
confRouter(router)

// 启动路由
router.start(Vue.extend(App), '#app')

// 暴露vm到全局
window.vm = vm
