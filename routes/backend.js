const router = require('koa-router')()

router.prefix('/server')
router.get('/', async (ctx, next) => {
    ctx.body = 'backend api'
})


module.exports = router
