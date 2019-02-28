const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostsSchema = new Schema({
  title: { type: String, require: true },
  categoryId: { type: Schema.Types.ObjectId, require: true }, // 文章分类
  postType: { type: String, require: true }, // 文章类型 -- 转载 原创 连载
  postOriginUrl: { type: String }, // 原文链接
  content: { type: String, require: true}, // 文章内容
  cover: { type: String, default: null }, // 封面
  author: { type: Schema.Types.ObjectId, require: true, ref: 'User'}, // 作者
  review: { type: Number, default: 0 }, // review
  like: { type: Number, user: Array, default: 0 },
  comments: { type: Schema.Types.ObjectId, ref: 'Comments'}, // comments
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Posts', PostsSchema)