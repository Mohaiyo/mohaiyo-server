const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminUserSchema = new Schema({
  name: { type: String, require: true },
  nickname: { type: String, require: true },
  password: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('AdminUser', AdminUserSchema)