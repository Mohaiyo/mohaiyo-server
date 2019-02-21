const Category = require('../models/posts/category')
const Comments = require('../models/posts/comments')
const ParentCategory = require('../models/posts/parentCategory')
const Reply = require('../models/posts/reply')
const Posts = require('../models/posts/posts')

const Users = require('../models/users')
const Admin = require('../models/admin')

module.exports = {
  Category,
  Comments,
  ParentCategory,
  Reply,
  Posts,
  Users,
  Admin
}