if (process.env.NODE_ENV === 'production') {
  require('env2')('./.env.prod');
} else {
  require('env2')('./.env');
}
const { env } = process
console.log(env)

module.exports = {
	// development config
	development: {
		mongo: {
			uri: `mongodb://${env.MONGODB_HOST}:${env.MONGODB_PORT}/${env.MONGODB_DB_NAME}`
		},
		port: `${env.PORT}`,
		alioss: {
			region: `${env.region}`,
			accessKeyId: `${env.accessKeyId}`,
			accessKeySecret: `${env.accessKeySecret}`,
			bucket: `${env.aliossbucket}`,
			folder: 'images/'
		},
		qiniu: { // 七牛云sdk配置 (仅供参考)
			ACCESS_KEY: `${env.ACCESS_KEY}`,
			SECRET_KEY: `${env.SECRET_KEY}`,
			bucket: `${env.bucket}`,
			baseUrl: `${env.baseUrl}`
		},
	},
	// production config
	production: {
		mongo: {
			uri: `mongodb://${env.MONGODB_HOST}:${env.MONGODB_PORT}/${env.MONGODB_DB_NAME}`
		},
		port: `${env.PORT}`,
		alioss: {
			region: `${env.region}`,
			accessKeyId: `${env.accessKeyId}`,
			accessKeySecret: `${env.accessKeySecret}`,
			bucket: `${env.aliossbucket}`,
			folder: 'images/'
		},
		qiniu: { // 七牛云sdk配置 (仅供参考)
			ACCESS_KEY: `${env.ACCESS_KEY}`,
			SECRET_KEY: `${env.SECRET_KEY}`,
			bucket: `${env.bucket}`,
			baseUrl: `${env.baseUrl}`
		},
	}
}