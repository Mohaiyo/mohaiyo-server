const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const db = require('./models/mogondb')
const koaBody = require('koa-body')

const { frontendRouter, backendRouter } = require('./routes')

// error handler
onerror(app)
app.keys = ['wayne'] // cookie的签名
const CONFIG = {
  key: 'koa:wayne',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7天
  // key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  // /** (number || 'session') maxAge in ms (default is 1 days) */
  // /** 'session' will result in a cookie that expires when session/browser is closed */
  // /** Warning: If a session cookie is stolen, this cookie will never expire */
  // maxAge: 86400000,
  // autoCommit: true, /** (boolean) automatically commit headers (default true) */
  // overwrite: true, /** (boolean) can overwrite or not (default true) */
  // httpOnly: true, /** (boolean) httpOnly or not (default true) */
  // signed: true, /** (boolean) signed or not (default true) */
  // rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  // renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())

app.use(require('koa-static')(__dirname + '/public'))

// koaBodyOption
const koaBodyOption = {
  formLimit: 2 * 1048576, // 最大1M
  textLimit: 2 * 1048576,
  formidable: {
    keepExtensions: true, // 带拓展名上传，否则上传的会是二进制文件而不是图片文件
    onFileBegin(name, file) {
      file.path = __dirname + '/public/images/' + file.name; // 重命名上传文件
    },
    uploadDir: __dirname + '/public/images'
  }, // 输出到images文件夹
  multipart: true,
}
app.use(koaBody(koaBodyOption))
// cookies
app.use(session(CONFIG, app))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// middlewares
app.use(require('./middlewares/res')) // 统一响应数据处理
app.use(require('./middlewares/tracer')) // 日志打印

// routes
app.use(frontendRouter.routes(), frontendRouter.allowedMethods()) // 前台路由
app.use(backendRouter.routes(), backendRouter.allowedMethods()) // 后台路由


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
