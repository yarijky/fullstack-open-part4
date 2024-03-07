const { test, after, beforeEach, describe, expect } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

const isPropertyDefined = (response, property) => {
  bool = false;
  response.body.forEach((blog) => {
    if (blog.hasOwnProperty(property)) {
      bool = true;
    }
  });
  return bool;
};

describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog);
      await blogObject.save();
    }
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");
    const title = response.body.map((r) => r.title);
    assert(title.includes("React patterns"));
  });

  describe("viewing a specific blog", () => {
    test("succeeds with a valid id", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });

    test("fails with statuscode 404 if blog does not exist", async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new blog", () => {
    test("succeeds with a valid data ", async () => {
      const newBlog = {
        _id: "5a422aa71b54a676234d17f9",
        title: "Il mio primo bellissimo libro",
        author: "Yarisssss",
        url: "http://www.google.com",
        likes: 19999,
        __v: 0,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const title = blogsAtEnd.map((n) => n.title);
      assert(title.includes("Il mio primo bellissimo libro"));
    });

    test("fails with status code 400 if data invalid", async () => {
      const newBlog = {
        author: "Yarisssss",
        url: "http://www.google.com",
      };

      await api.post("/api/blogs").send(newBlog).expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const titles = blogsAtEnd.map((r) => r.title);
      assert(!titles.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });
  });

  describe("update a blog", () => {
    test("succeeds with status code 200 if id is valid", async () => {
      const initialBlogs = await helper.blogsInDb();
      const blogtoUpdate = initialBlogs[0];

      const updatedBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 10,
      };

      await api
        .put(`/api/blogs/${blogtoUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

      const title = blogsAtEnd.map((n) => n.title);
      assert(title.includes("React patterns"));
    });
  });

  describe("other", () => {
    test("a blog is identified by an id", async () => {
      const response = await api.get("/api/blogs");
      assert.strictEqual(isPropertyDefined(response, "id"), true);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});