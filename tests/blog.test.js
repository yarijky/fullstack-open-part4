const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
];

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });
});

const bestBlog = {
  _id: "5a422b3a1b54a676234d17f9",
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  likes: 12,
  __v: 0,
};

describe("Best blogs by likes", () => {
  test("of empty list is empty", () => {
    const result = listHelper.favoriteBlog([]);
    assert.deepStrictEqual(result, {});
  });

  test("when list has only one blog equals of that", () => {
    const result = listHelper.favoriteBlog([bestBlog]);
    assert.deepStrictEqual(result, bestBlog);
  });

  test("of a bigger list find the best", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, bestBlog);
  });
});

const mostAuthor = {
  author: "Robert C. Martin",
  blogs: 3,
};

describe("Most blogs by author", () => {
  test("of empty list is empty", () => {
    const result = listHelper.mostBlog([]);
    assert.deepStrictEqual(result, {});
  });

  test("when list has only one blog equals of that", () => {
    const result = listHelper.mostBlog([bestBlog]);
    assert.deepStrictEqual(result, {"author":bestBlog.author, "blogs": 1});
  });

  test("of a bigger list find the best", () => {
    const result = listHelper.mostBlog(blogs);
    assert.deepStrictEqual(result, mostAuthor);
  });
});


const mostLikesAuthor = {
  author: "Edsger W. Dijkstra",
  likes: 17,
};

describe("Most likes by author", () => {
  test("of empty list is empty", () => {
    const result = listHelper.mostLikes([]);
    assert.deepStrictEqual(result, {});
  });

  test("when list has only one blog equals of that", () => {
    const result = listHelper.mostLikes([bestBlog]);
    assert.deepStrictEqual(result, {"author": bestBlog.author, "likes": bestBlog.likes});
  });

  test("of a bigger list find the best", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, mostLikesAuthor);
  });
});
