const request = require("supertest");
// const express = require("express");

// const indexRouter = require("../routes/index");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = require("../app");

// const app = express();
// indexRouter(app);

// before all test blocks
let user01 = { username: "user01", password: "password01" };
let user02 = { username: "user02", password: "password02" };
let userNotFound = { username: "userNoFound", password: "password" };

async function signUpUser(username, password) {
  await request(app)
    .post("/users/signup")
    .send({
      username,
      password
    });
}

beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
  await signUpUser(user01.username, user01.password);
  await signUpUser(user02.username, user02.password);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("GET / should return status 200", async () => {
  const response = await request(app).get("/");
  expect(response.status).toBe(200);
});

test("POST /login should return status 200 for valid login", async () => {
  const response = await request(app)
    .post("/login")
    .send({
      username: user01.username,
      password: user01.password
    });
  expect(response.status).toBe(200);
});

test("POST /login should return status 401 for invalid login", async () => {
  const response = await request(app)
    .post("/login")
    .send({
      username: user01.username,
      password: user02.password
    });
  expect(response.status).toBe(401);
  expect(response.body.message).toBe("password does not match");
});

test("POST /login should return status 401 for  user not found", async () => {
  const response = await request(app)
    .post("/login")
    .send({
      username: userNotFound.username,
      password: userNotFound.password
    });
  expect(response.status).toBe(401);
  expect(response.body.message).toBe("no such user found");
});
