const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminUserSchema = new Schema({
  name: { type: String, require: true },
  nickName: { type: String, require: true },
  password: { type: String, require: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
})

module.export = mongoose.model('AdminUser', AdminUserSchema)