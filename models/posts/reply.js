const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReplysSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User'},
  content: { type: String, require: true },
  like: { type: Number, default: 0 },
  reply: [{ type: Schema.Types.ObjectId, ref:'User' }], 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Replys', ReplysSchema)