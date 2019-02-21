const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  name: { type: String, require: true },
  info: { type: String, default: ''},
  parentCate: { type: Schema.Types.ObjectId, ref: 'parentCategory'},
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Category', CategorySchema)