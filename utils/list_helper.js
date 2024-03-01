const _ = require('lodash')

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, next) => (prev.likes > next.likes) ? prev : next,  {})
}

const mostBlog = (blogs) => {
  if (blogs.length === 0) return {}
  const result = _(blogs)
    .countBy("author")
    .map((v, k) => ({"author": k, "blogs": v}))
    .maxBy("blogs")
  return (result)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}
  const result = _(blogs)
    .groupBy("author")
    .map((item, key) => {
      let obj = {}
      obj["author"] = key
      obj["likes"] = _.sumBy(item, "likes")
      return obj
      })
    .maxBy("likes")
    // .value()
  return (result)
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostLikes
};