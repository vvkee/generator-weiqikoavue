import Router from 'koa-router'
import controller from '../controller'

const router = new Router()

router.get('/', controller.home.index)

export default router
