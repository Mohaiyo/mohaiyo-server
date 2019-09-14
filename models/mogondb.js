const mongoose = require('mongoose')
const config = require('../config/index')
const uri = config[process.env.NODE_ENV].mongo.uri
const option = {
    autoIndex: false,
    useNewUrlParser: true
}
mongoose.connect(uri, option).then(_ => {
    console.log('mongodb数据库连接成功')
}).catch(err => {
    console.log(err)
    console.log('数据库连接失败')
})