const path = require('path')
const logger = require('tracer').colorConsole({
  level: 'error',
  format: [
    "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})", //default format
    {
      error: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}" // error format
    }
  ],
  dateformat: "HH:MM:ss.L",
  preprocess: function (data) {
    data.title = data.title.toUpperCase();
  },
  file: 'error.log',
  path: path.resolve(__dirname, '../')
})

module.exports = async (ctx,next)=>{
  try{
    await next();
  } catch (err){
    if (!err) {
      return ctx.error({ msg:new Error('未知错误!') });
    } 
    if (typeof(err)=='string') {
      return ctx.error({ msg:new Error(err) });
    }
    logger.error(err.stack);
    ctx.error({msg:'服务器错误!',error: err, status: ctx.status });
  }
}
