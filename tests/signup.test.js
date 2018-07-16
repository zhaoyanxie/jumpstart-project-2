const request = require("supertest");
const express = require("express");

const signupRouter = require("../routes/signup");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = express();
signupRouter(app);

const user01 = {
  username: "user01",
  password: "password01"
};

const userNoUsername = {
  password: "password"
};

// before all test blocks
beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll( () => {
  mongoose.disconnect();
  mongod.stop();
});

test("should ", () => {
  expect(1).toBe(1);
});

test("POST /signup - post a unique new user should return response status 200", async () => {
  const response = await request(app)
    .post("/signup")
    .send(user01);
  expect(response.status).toBe(200);
});

// // invalid signup - duplicate user
test("POST /signup - post a duplicate new user should return response status 500", async () => {
  const response = await request(app)
    .post("/signup")
    .send(user01);
  expect(response.status).toBe(500);
});

// // invalid signup - no username
test("POST /signup - post a new user with no username should return response status 500", async () => {
  const response = await request(app)
    .post("/signup")
    .send(userNoUsername);
  expect(response.status).toBe(500);
});
