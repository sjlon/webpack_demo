const Koa = require('koa')
const Router = require('@koa/router')
const path = require('path')
// const cors = require('@koa/cors')
const static = require('koa-static')

const app = new Koa()
const router = new Router()
// 静态资源托管
app.use(static(path.resolve(__dirname, '../dist')))
// app.use(cors())

router.get('/api/getUserInfo', (ctx, next) => {
    ctx.body = {
        name: '小黑',
        age: 19
    }
})
app
  .use(router.routes())
  .use(router.allowedMethods())
app.listen(9001, () => {
    console.log('server is runing http://127.0.0.1:9001')
})
