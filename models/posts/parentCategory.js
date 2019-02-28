
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ParentCategorySchema = new Schema({
  name: { type: String, require: true },
  info: { type: String, default: ''},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('ParentCategory', ParentCategorySchema)