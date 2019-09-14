import md5 from 'md5'
import {
  AdminModel
} from '../../models'
import AdminConfig from '../../config/admin'

class BackEndUsers {

  // 添加管理员
  static async createAdmin(ctx) {
    const {
      name,
      nickname,
      password
    } = ctx.request.body;
    if (!name || !password) return ctx.render('error', {
      message: '用户或密码不能为空!',
      error: {
        status: 400
      }
    })
    const isexit = await AdminModel.findOne({
      name
    });
    if (isexit) return ctx.render('error', {
      message: '该用户已存在!',
      error: {
        status: 400
      }
    })
    await AdminModel.create({
      name,
      nickname,
      password: md5(password)
    });
    ctx.redirect('/server/');
  }

  // 后台用户登录
  static async signIn(ctx) {
    const {
      name,
      password
    } = ctx.request.body;
    if (!name || !password) return ctx.render('error', {
      message: '请输入用户名或者密码!',
      error: {
        status: 404
      }
    })
    if (name == AdminConfig.name && md5(password) == AdminConfig.password) {
      ctx.session.user = {
        name,
        password
      };
      ctx.redirect('/server/home');
    }
    const result = await AdminModel.findOne({
      name,
      password: md5(password)
    });
    if (!result) return ctx.render('error', {
      message: '用户或密码错误!',
      error: {
        status: 400
      }
    })
    ctx.session.user = result;
    ctx.redirect('/server/home');
  }

  // 后台用户退出
  static async signOut(ctx) {
    ctx.session.user = null;
    return ctx.render('login', {
      title: 'Wayne-blog管理后台'
    });
  }
}

module.exports = BackEndUsers