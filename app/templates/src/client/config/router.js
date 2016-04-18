import indexPage from '../view/index'
import loginPage from '../view/login'

export default router => {

    // 对路由进行匹配
    router.map({
        '/': {
            name: 'index',
            component: indexPage
        },
        'login': {
            name: 'login',
            component: loginPage
        }
    })
}
