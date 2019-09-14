import koaRouter from 'koa-router'
const BackEndMain = require('../controllers/backend/index')
const BackEndUsers = require('../controllers/backend/user')
const BackEndPosts = require('../controllers/backend/posts')

const router = koaRouter()
router.prefix('/server')
router.get('/', BackEndMain.Login) // 首页 登录页面
    // 用户相关
    .post('/login', BackEndUsers.signIn) // 用户登录接口
    .post('/user/createAdmin', BackEndUsers.createAdmin) // 添加管理员
    .get('/signout', BackEndUsers.signOut) // 退出登录
    .get('/user', BackEndMain.user)
    // 文章相关
    .get('/home', BackEndMain.Home) // 管理后台主页
    .get('/category', BackEndMain.Category) // 分类管理主页
    .get('/posts', BackEndMain.posts) // 文章管理主页
    .post('/posts/createTcate', BackEndPosts.createTcate) // 创建一级分类
    .post('/posts/createSubcate', BackEndPosts.createSubcate) // 创建二级分类
    .post('/posts/putTcate', BackEndPosts.putTcate) // 编辑一级分类
    .post('/posts/putSubcate', BackEndPosts.putSubcate) // 编辑二级分类
    .get('/posts/deleteCate/:id', BackEndPosts.deleteCate); // 删除分类

export default router