import koaRouter from 'koa-router'
import upload from '../middlewares/upload'
import UserController from '../controllers/frontend/user'
import PostsController from '../controllers/frontend/posts'
const router = koaRouter()
router.prefix('/api')
router
  .get('/', async (ctx, next) => {
    ctx.body = {msg: 'frontend api'}
  })
  .post('/user/register', UserController.register) // 注册
  .post('/user/login', UserController.login) // 登陆
  .get('/user/logout', UserController.logout) // 登出
  .post('/user/updatePsw', UserController.modifyPassword) // 修改密码
  .get('/user/getUserInfo', UserController.getUserInfo) // 获取用户信息
  .put('/user/updateInfo', UserController.updateUserInfo) // 更新用户信息
  .post('/user/uploadAvatar', upload.alioss, UserController.uploadAvatar) // 更新头像

  .post('/user/createpost', PostsController.createPost) // 创建文章
  .get('/user/getPostsLists', PostsController.getPostsLists) // 获取首页文章
  .post('/user/uploadcover', upload.alioss, PostsController.uploadCover) // 上传封面
  .post('/user/createComment', PostsController.createComment) // 评论
  .get('/user/getPostDetail', PostsController.getPostDetail) // 获取文章详情
  .post('/user/likePost', PostsController.likePost) // 点赞或者取消点赞
  .post('/user/editPost', PostsController.editPost) // 编辑文章
  .post('/user/deletePost', PostsController.deletePost) // 删除文章
  .post('/user/deleteComment', PostsController.deleteComment) // 删除评论

export default router