const md5 = require('md5')
const UserModel = require('../../models/users/users')
const PostsModel = require('../../models/posts/posts')
// const UserModel = mongoose.model('User') ?
// const PostsModel = mongoose.model('Posts') ?

class UserContrller {
  static async register (ctx) { // 注册
    const { name, nickName, password, againPassword } = ctx.request.body
    if (!name || !password) {
      return ctx.error({msg: '用户名或者密码不能为空'})
    }
    if (!nickName) {
      return ctx.error({msg: '昵称不能为空'})
    }
    if (password !== againPassword) {
      return ctx.error({msg: '两次输入的密码不一致'})
    }
    const isHaveUser = await UserModel.findOne({ name })
    if (isHaveUser) {
      return ctx.error({msg: '用户名已经存在'})
    }
    const res = await UserModel.create({name, password: md5(password), nickName})
    if (!res) {
      return ctx.error({msg: '注册失败'})
    } else {
      return ctx.success({msg: '注册成功'})
    }
  }

  static async login(ctx) { // 登陆
    const { name, password } = ctx.request.body
    if (!name || !password) {
      return ctx.error({ msg: '用户名或者密码不能为空'})
    }
    const user = await UserModel.findOne({name, password: md5(password)}, {password: 0})
    if (!user) {
      return ctx.error({msg: '用户名或者密码错误'})
    }
    ctx.session.user = user // session记录用户信息
    const id = user._id
    const avatar = null
    if (user.avatar) {
      avatar = user.avatar
    }
    const maxAge = 7 * 24 * 60 * 60 * 1000
    ctx.cookies.set('userid', id, {maxAge, httpOnly: false})
    ctx.cookies.set('username', name, {maxAge, httpOnly: false})
    if (avatar) {
      ctx.cookies.set('avatar', avatar, {maxAge, httpOnly: false})
    }
    return ctx.success({ msg: '登陆成功'})
  }
 
  static async logout(ctx) { // 用户退出登陆
    const { userid } = ctx.query
    if (!userid) {
      return ctx.error({ msg: '用户id不存在'})
    }
    const cookie_userid = ctx.cookies.get('userid')
    const user = ctx.session.user
    if (!user && cookie_userid !== userid) { // 此处判断当前userid与cookie中userid是否一致
      return ctx.error({msg: '该用户已经退出'})
    }
    ctx.session.user = null
    ctx.cookies.userid = null
    ctx.cookies.username = null
    ctx.cookies.avatar = null
    return ctx.success({msg: '用户登出成功'})
    // 可以重复退出？
  }

  static async modifyPassword(ctx) { // 修改密码
    const { userid, oldpassword, newpassword } = ctx.request.body
    if (!userid || !oldpassword || !newpassword) {
      return ctx.error({msg: '传参有误'})
    }
    const user = await UserModel.findOne({_id: userid, password: md5(oldpassword)})
    if (!user) {
      return ctx.error({msg: '旧密码输入有误'})
    }
    const modifyRes = await UserModel.update({_id: userid, password: md5(oldpassword)}, {password: md5(newpassword)})
    if (!modifyRes) {
      return ctx.error({msg: '密码更新失败'})
    }
    ctx.success({msg: '密码更新成功'})
  }

  static async getUserInfo(ctx) {
    let { userid, page, size } = ctx.query
    if (!userid) {
      return ctx.error({msg: '用户id不能为空'})
    }
    const user = await UserModel.findById(userid).select({password: 0})
    if (!user) {
      return ctx.error({msg: '该用户不存在'})
    }

    if (!page) {
      page = 1
    }

    if(!size) {
      size = 10
    }
    const skip = (Number(page) - 1) * (Number(size))
    const totals = await PostsModel.find({author: userid}).count()
    const postsList = await PostsModel.find({author: userid}).sort({createdAt: -1}).skip(skip).limit(Number(size))
    return ctx.success({
      msg: '查找用户信息成功',
      data: {
        user,
        totals,
        postsList
      }
    })
  }

  static async updateUserInfo(ctx) {
    const { userid, email, bio } = ctx.request.body
    if (!userid) {
      return ctx.error({msg: '用户id不能为空'})
    }
    const user = await UserModel.findById(userid).select({password: 0})
    if (!user) {
      return ctx.error({msg: '该用户不存在'})
    }
    const updateRes = await UserModel.findByIdAndUpdate(userid, {email, bio})
    if (!updateRes) {
      return ctx.error({msg: '更新用户基本信息失败'})
    }
    
    const userInfo = await UserModel.findById(userid).select({password: 0, _id: 0, createdAt: 0, updatedAt: 0})
    if (!userInfo) {
      return ctx.error({msg: '查找用户信息失败'})
    }
    return ctx.success({msg: '更新用户信息成功', data: {
      userInfo
    }})
  }

   // 上传用户头像
   /*
    * 上传逻辑由中间件 /middlewares/upload 统一处理
    * 此处只需处理上传的结果
    */
  static async uploadAvatar(ctx) {
    const { id, url} = ctx.upload
    if (!url) {
      return ctx.error({msg: '上传头像失败'})
    }
    const updatRes = await UserModel.findByIdAndUpdate(id, { avatar: url })
    if (!updatRes) {
      return ctx.error({msg: '用户头像更新失败'})
    }
    return ctx.success({msg:'上传成功!', data: { url }})
  }
}

module.exports = UserContrller