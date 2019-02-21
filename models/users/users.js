const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	name: { type: String,require: true }, // 用户名
	nickName: { type: String,require: true}, // 昵称
	email: { type: String, default: '' },
	avatar: { type: String, default: '' },
	bio: { type: String, default: '' },
	password: { type: String, require: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)