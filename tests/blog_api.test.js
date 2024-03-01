const { test, after, beforeEach } = require('node:test')
const assert = require('assert');
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  // assert.strictEqual(response.body.length, helper.initialBlogs.length)
  assert.strictEqual(response.body.length, 2)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const title = response.body.map(r => r.title)

  assert(title.includes('React patterns'))
})

test('a valid blog can be added ', async () => {
  const newBlog = {
      _id: "5a422aa71b54a676234d17f9",
      title: "Il mio primo bellissimo libro",
      author: "Yarisssss",
      url: "http://www.google.com",
      likes: 19999,
      __v: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  // assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert.strictEqual(blogsAtEnd.length, 3)

  const title = blogsAtEnd.map(n => n.title)
  assert(title.includes('Il mio primo bellissimo libro'))
})

test('blog without content is not added', async () => {
  const newBlog = {
    author: "Yarisssss",
    url: "http://www.google.com",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  // assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  assert.strictEqual(blogsAtEnd.length, 2)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]


  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, 1)
  // assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test.only('a blog is identified by an id', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

after(async () => {
  await mongoose.connection.close()
})