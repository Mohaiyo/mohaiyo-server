import {
  PostsModel,
  CommentsModel,
  CategoryModel,
  ParentCategoryModel
} from '../../models/index'
import dayjs from 'dayjs'
class PostsController {
  static async createPost(ctx) {
    const { user } = ctx.session.user
    if (!user) {
      return ctx.error({msg: '请先登录哦~'})
    }
    const { _id } = user
    const { data } = ctx.request.body
    if (!data) {
      return ctx.error({msg: '文章数据发送失败'})
    }
    data.author = _id
    data.like = { num: 0, user: []}
    const res = await PostsModel.create(data)
    if (!res) {
      return ctx.error({msg: '创建文章失败'})
    }
    return ctx.success({msg: '创建文章成功'})
  }

  static async getPostsLists(ctx) {
    let { page, size, categoryId } = ctx.query
    if (!page) {
      page = 1
    }
    if (!size) {
      size = 10
    }
    let params = {}
    if (categoryId) {
      params.categoryId = categoryId
    }
    const nowdate = dayjs().format('YYYY-MM-DD HH:mm')
    const weekdate = dayjs().subtract(7, 'days').format('YYYY-MM-DD HH:mm')
    let catehot
    let hot
    const skipNum = (Number(page - 1)) * Number(size)
    const totals = await PostsModel.find(params).count()
    const lists = await PostsModel.find(params).sort({ createdAt: -1, review: -1}).skip(skipNum).limit(Number(size)).populate('author', {nickName: 1, avatar: 1}).populate('comments')
    if (!lists) {
      return ctx.error({msg: '暂无数据'})
    }

    const weekhotLists = await PostsModel.find({ cover: {$exists: true, $ne: null}, createdAt: {$in: [nowdate, weekdate]}})
    if (weekhotLists && weekhotLists.length > 3) {
      // 一周内发布的 前4条有封面图的阅读量最多的热门文章
      hot = await PostsModel.find({ cover: {$exists: true, $ne: null}, createdAt: {$in: [nowdate, weekdate]}}).sort({review: -1}).limit(4).populate('author', { nickname: 1, avatar: 1})
    } else {
      // 如果不足4条就取所有的文章中前4条有封面图的、阅读量最多热门文章
      hot = await PostsModel.find({ cover: {$exists: true, $ne: null} }).sort({ review: -1}).limit(4).populate('author', { nickname: 1, avatar: 1})
    }
    
    if (categoryId) {
      catehot = await PostsModel.find({categoryId}, { title: 1, review: 1, author: 1}).sort({review: -1}).limit(10)
      if (!catehot) {
        return ctx.error({ msg: 暂无数据})
      }
    }
    ctx.success({
      msg: '数据查询成功',
      data: {
        lists,
        hot,
        totals,
        catehot
      }
    })
  }

  static async uploadCover(ctx) {
    const { url, id } = ctx.upload
    if (!url) {
      return ctx.error({msg: '封面上传失败'})
    }
    return ctx.success({msg: '封面上传成功', data: {url, id}})
  }

  static async createComment(ctx) {
    const { user } = ctx.session.user
    if (!user) {
      return ctx.error({msg: '请先登录哦~'})
    }
    const { _id, name, avatar, nickname } = user
    const { data } = ctx.request.body
    if (!data) {
      return ctx.error({msg: '数据发送失败'})
    }
    data.author = { _id, name, avatar, nickname }
    const res = await CommentsModel.create(data)
    if (!res) {
      return ctx.error({ msg: '评论失败'})
    }
    const postid = data.post_id
    const fields = {$push: {'comments': postid}}
    const updatePostRes = await PostsModel.findByIdAndUpdate(postid, fields)
    if (!updatePostRes) {
      return ctx.error({ msg: '评论失败'})
    }
    const comments = await CommentsModel.find({post_id: postid}).sort({ createdAt: -1 }).limit(10)

    return ctx.success({msg: '评论成功', data: {
      comments
    }})
  }

  static async queryCategory(ctx) { // 查询二级分类
    const data = await CategoryModel.find()
    if (!data) {
      return ctx.error({ msg: '暂无分类数据' })
    }
    return ctx.success({ msg: '二级分类查询成功', data})
  }
  
  // 查询分类菜单
  static async qureyAllCate(ctx) {
    const scate = await CategoryModel.find().populate('parentCate')
    const pcate = await ParentCategoryModel.find()
    return ctx.success({
      msg: '查询所有分类成功',
      data: {
        scate,
        pcate
      }
    })
  }

  // 查询文章详情 以及评论
  static async getPostDetail(ctx) {
    let islike = false
    let { postid, userid, size, page } = ctx.query
    if (!postid) {
      return ctx.error({msg: '传参有误'})
    }
    const detail = await PostsModel.findById(postid).populate('author', {password: 0}).populate('comments')
    if (!detail) {
      return ctx.error({ msg: '该文章不存在或者已经被原作者删除~'})
    }
    console.log(detail)
    let review = detail.review + 1
    const fields = {$set: { review }}
    await PostsModel.findByIdAndUpdate(postid, fields).exec()

    if (!page) {
      page = 1
    }
    if (size) {
      size = 10
    }
    
    const skipNum = (Number(page) - 1) * Number(size)
    const totals = await CommentsModel.find({post_id: post}).count()
    const comments = await CommentsModel.find({post_id: postid}).sort({ createdAt: -1, review: -1 }).skip(skipNum).limit(Number(size))
    
    // 点赞数以及点赞的状态
    const likeRes = await PostsModel.findById(postid, {like: 1})
    if (!likeRes && !likeRes.like) {
      return ctx.error({ msg: '查找文章点赞数据失败'})
    }
    
    if (userid) {
      if (likeRes.like.user && !likeRes.like.user.includes(userid)) {
        islike = false
      } else {
        islike = true
      }
    }
    return ctx.success({msg: '查询成功', data: {
      detail,
      totals,
      comments,
      likeRes,
      islike
    }})
  }

  // 点赞 取消点赞文章
  static async likePost(ctx) {
    const { user } = ctx.session.user
    let num
    let likeUserArr
    if(!user) {
      return ctx.error({msg: '您还没登录哦'})
    }
    const { _id } = user
    const { postid } = ctx.request.body

    const likeRes = await PostsModel.findById(postid, {like: 1})
    if (!likeRes && !likeRes.like) {
      return ctx.error({ msg: '查找文章点赞数据失败'})
    }
    if (likeRes.like.user && !likeRes.like.user.includes(_id)) { // 点赞
      if (!likeRes.like.num) {
        num = 1
      } else {
        num = likeRes.like.num + 1
      }
      likeUserArr = likeRes.like.user
      likeUserArr.push(_id)
    } else { // 取消点赞
      if (!likeRes.like.num) {
        num = 1
      } else {
        num = likeRes.like.num - 1
      }
      likeUserArr = likeRes.like.user
      likeUserArr = likeUserArr.filter(item => {
        return item !== _id
      })
    }

    const updateData = {
      num,
      user: likeUserArr
    }

    const likeUpdateRes = await PostsModel.findByIdAndUpdate(postid, {$set: {like: updateData}}, {new: true}).populate('author',{ password:0 }).populate('comments')
    if (!likeUpdateRes) {
      return ctx.error({ msg: '点赞/取消点赞失败'})
    }
    if (likeRes.like.user.includes(_id)) {
      return ctx.success({msg: '点赞成功', data: {likeUpdateRes}})
    } else {
      return ctx.success({msg: '取消点赞成功', data: {likeUpdateRes}})
    }
    
  }

  // 编辑文章
  static async editPost(ctx) {
    const { id } = ctx.request.body
    return ctx.success({ msg:'待开发' })
  }

  // 删除文章
  static async deletePost(ctx) {
    const { user } = ctx.session.user
    if (!user) {
      return ctx.error({ msg: '用户未登录'})
    }
    const { id } = ctx.request.body
    const deleteRes = await PostsModel.findByIdAndDelete(id)
    if (!deleteRes) {
      return ctx.error({msg: '删除失败'})
    }
    return ctx.success({msg: '删除成功'})
  }
  // 删除评论
  static async deleteComment(ctx) {
    // 用户需要先登录  先查找到文章下面的所有评论  只有属于该用户的评论才可以删除
    const { userid, commentid } = ctx.request.body
    return ctx.success({ msg:'待开发' })
  }
}

module.exports = PostsController