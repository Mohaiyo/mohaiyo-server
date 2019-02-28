const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentsSchema = new Schema({
  author: { type: Object},
  post_id: { type: Schema.Types.ObjectId, require: true },
  content: { type: String, require: true },
  like: { type: Number, user: Array, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Comments', CommentsSchema)