# mohaiyo-sever

**mohaiyo-server**博客后台。

## 项目介绍

**mohaiyo-server**开发基于koa2。是博客前端的后台的实现。支持async/await,pm2部署，支持阿里云oss以及七牛云存储，自带管理后台。

## 主要技术栈

- nodejs
- koa2
- mongoose && mongodb
- docker
- pm2

## required

- node版本7.x，推荐使用最新稳定版本,使用koa2，默认支持async/await，7.x以上node版本
- 确保本地已经安装以及已经启动了mongodb,且可以正常访问

## 安装教程

1. npm install or yarn install

## 项目配置

端口，阿里云或者七牛云配置请参考`.env.example`以及`config/index.js`

![config](/snapshot/config.png)

## 项目结构

```js
.
├── config // 项目配置文件
├── controllers // 接口逻辑层
│    ├──backend // 后台接口逻辑层
│    ├──data // 数据相关
│    └──frontend 前端接口逻辑层
├── middlewares // 中间件
├── models // schema mongodb models
├── public // 后台静态资源目录
├── routes // 路由文件
├── snapshot // 项目截图
├── utils // 阿里 七牛传封装
├── views // 后台视图文件 ejs
├── .env.example // env文件
├── app.js // 入口文件
├── deploy.sh // 部署脚本
├── ecosystem.config.js // pm2
├── release-example.sh // 发布脚本示例
.
```

## 使用说明

- 开发环境
  v
```bash
npm run dev
```

- 正式环境

```bash
npm run pro
```

- deploy

```bash
sh release.sh
```
