
export default {
  // 分类管理
  category: [{
    label: '一级分类',
    route: '/server/category?type=category&subType=ParentCategory&item=1'
  }, {
    label: '二级分类',
    route: '/server/category?type=category&subType=Category&item=2'
  }],
  // 文章管理
  posts: [{
    label: '文章列表',
    route: '/server/posts?type=posts&item=1'
  }, {
    label: '评论管理',
    route: '/server/posts?type=posts&item=2'
  }],
  // 用户管理
  user: [{
    label: '用户列表',
    route: '/server/user?type=user&item=1'
  }, {
    label: '权限管理',
    route: '/server/user?type=user&item=2'
  }],
}