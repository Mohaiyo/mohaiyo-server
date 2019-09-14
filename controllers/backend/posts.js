import {
  ParentCategoryModel,
  CategoryModel
} from '../../models'
class BackEndPosts {
  static async createTcate(ctx) {
    const {
      name,
      info
    } = ctx.request.body;
    if (!name) {
      return ctx.render('error', {
        message: '分类名称不能为空~',
        error: {
          status: 500
        }
      })
    }
    const isexit = await ParentCategoryModel.findOne({
      name
    })
    if (isexit) {
      return ctx.render('error', {
        message: '分类已经存在',
        error: {
          status: 400
        }
      })
    }

    await ParentCategoryModel.create({
      name,
      info
    });
    ctx.redirect('back');
  }

  static async createSubcate(ctx) {
    const {
      name,
      info,
      parentCate
    } = ctx.request.body;
    if (!name) {
      return ctx.render('error', {
        message: '分类名称不能为空~',
        error: {
          status: 500
        }
      })
    }
    const isexit = await CategoryModel.findOne({
      name
    })
    if (isexit) {
      return ctx.render('error', {
        message: '分类已经存在',
        error: {
          status: 400
        }
      })
    }

    await CategoryModel.create({
      name,
      info,
      parentCate
    });
    ctx.redirect('back');
  }

  static async putTcate(ctx) {
    const { id, name } = ctx.request.body
    if (!id || !name) {
      return ctx.render('error', {
        message: '参数不能为空',
        error: {
          status: 500
        }
      })
    }
    await ParentCategoryModel.findByIdAndUpdate(id, {name})
    ctx.redirect('back')
  }

  static async putSubcate(ctx) {
    const { parentCate, name, info, cateid } = ctx.request.body
    if (!parentCate || !name || !info || !cateid) {
      return ctx.render('error', {
        message: '参数不能为空',
        error: {
          status: 500
        }
      })
    }
    await CategoryModel.findByIdAndUpdate(cateid, {
      name,
      info,
      parentCate
    })
    ctx.redirect('back')
  }
  static async deleteCate(ctx) {
    const {
      subType,
      type
    } = ctx.query;
    const {
      id
    } = ctx.params;
    if (!id || !subType) return ctx.render('error', {
      message: '参数错误!',
      error: {
        status: 400
      }
    })
    if (subType === 'ParentCategory') {
      await ParentCategoryModel.findByIdAndRemove(id);
    } else {
      await CategoryModel.findByIdAndRemove(id);
    }
    ctx.redirect('back');
  }
}

module.exports = BackEndPosts