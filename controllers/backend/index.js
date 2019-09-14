import menu from '../data/menu'
import dayjs from 'dayjs'
import {
  ParentCategoryModel,
  CategoryModel
} from '../../models'
class BackEndMain {
  // 管理后台登录
  static async Login(ctx) {
    return ctx.render('login', {title: 'Wayne-blog管理后台'})
  }

  // 首页
  static async Home(ctx) {
    const { user } = ctx.session
    return ctx.render('home', {title: 'blog管理后台首页', message: '这里是管理后台首页', user})
  }

  static async Category(ctx) {
    let Index = 1;
    let current = 1;
    let count = 0;
    let data
    const user = ctx.session.user;
    const {
      type,
      subType,
      item,
      page
    } = ctx.query;

    if (item) {
      Index = item
    }
    if (page) {
      current = page
    }
    const limit = 6;
    const skip = (Number(current) - 1) * limit;
    if (subType === 'ParentCategory') {
      count = await ParentCategoryModel.count()
      data = await ParentCategoryModel.find().skip(skip).limit(limit)
    } else {
      count = await CategoryModel.count()
      data = await CategoryModel.find().skip(skip).limit(limit).populate('parentCate')
    }
    const topCate = await ParentCategoryModel.find();

    return ctx.render(type, {
      title: 'Wayne-blog管理平台',
      data,
      subType,
      user,
      count,
      type,
      topCate,
      current,
      dayjs,
      index: Index,
      path: 'categorys/' + subType,
      menu: menu[type]
    });

  }


  // 文章管理
  static async posts(ctx) {
    let Index = 1;
    const {
      type,
      item
    } = ctx.query;
    if (item) Index = item;
    const user = ctx.session.user;
    return ctx.render('posts', {
      title: 'Wayne管理平台',
      message: '文章管理',
      user,
      index: Index,
      menu: menu[type]
    });
  }

  // 用户管理
  static async user(ctx) {
    let Index = 1;
    const {
      type,
      item
    } = ctx.query;
    if (item) Index = item;
    const user = ctx.session.user;
    return ctx.render('user', {
      title: 'Wayne管理平台',
      message: '用户管理',
      user,
      index: Index,
      menu: menu[type]
    });
  }
}

module.exports =  BackEndMain