// const co = require('co')
const OSS = require('ali-oss')
const config = require('../config/index')
const globalConfig = config[process.env.NODE_ENV || 'development']

module.exports = (key, path) => {
  const client = new OSS(globalConfig.alioss)
  // return new Promise((resolve, reject) => { // 以前的写法
  //   co(function* () {
  //     const result = yield client.put(key, path)
  //     resolve(result)
  //   }).catch(function (err) {
  //     reject(err)
  //   })
  // })
  async function put() {
    try {
      // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
      let r1 = await client.put(key, path)
      console.log('put success: %j', r1)
      // let r2 = await client.get(key)
      // console.log('get success: %j', r2)
      return r1
    } catch (err) {
      console.error('error: %j', err)
      return err
    }
  }
  put()
}
