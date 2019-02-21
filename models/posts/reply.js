const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReplysSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User'},
  content: { type: String, require: true },
  like: { type: Number, default: 0 },
  reply: [{ type: Schema.Types.ObjectId, ref:'User' }], 
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Replys', ReplysSchema)