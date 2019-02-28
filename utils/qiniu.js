const qiniu = require("qiniu")
const config = require('../config/index')
const globalConfig = config[process.env.NODE_ENV || 'development']

module.exports = (key, path) => {
  const qiniunconfig = globalConfig.qiniu
  const baseurl = qiniunconfig.baseUrl
  qiniu.conf.ACCESS_KEY = qiniunconfig.ACCESS_KEY
  qiniu.conf.SECRET_KEY = qiniunconfig.SECRET_KEY

  const uptoken = (bucket, key) => {
    let putPolicy = new qiniu.rs.PutPolicy(bucket + ':'+ key)
    return putPolicy.token()
  }
  //生成上传 Token
  const token = uptoken(qiniunconfig.bucket, key)

  //构造上传函数
  function uploadFile(uptoken, key, localFile) {
    var extra = new qiniu.io.PutExtra()
    return new Promise((resolve, reject) => {
      qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
        if (!err) {
          // 上传成功， 处理返回值
           resolve({
             hash: ret.hash,
             key: ret.key,
             url: baseurl + ret.key
           })
        } else {
          // 上传失败， 处理返回代码
          reject(err)
        }
      })
    })
  }
  //调用uploadFile上传
  uploadFile(token, key, path)
  // const extra = new qiniu.io.PutExtra()
  // return new Promise((resolve, reject) => {
  //   qiniu.io.putFile(token, key, path, extra, function (err, ret) {
  //     if (!err) {
  //       resolve({
  //         hash: ret.hash,
  //         key: ret.key,
  //         url: baseurl + ret.key
  //       })
  //     } else {
  //       reject(err)
  //     }
  //   })
  // })
}