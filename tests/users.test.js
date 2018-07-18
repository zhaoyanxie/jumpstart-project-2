const request = require("supertest");
const User = require("../models/user");
const express = require("express");

const usersRouter = require("../routes/users");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = require("../app");
// const app = express();
// usersRouter(app);

const user01 = {
  username: "user01",
  password: "password01"
};

const user02 = {
  username: "user02",
  password: "password02"
};
const userNoUsername = {
  password: "password"
};

async function signUpUser(username, password) {
  await request(app)
    .post("/users/signup")
    .send({
      username,
      password
    });
}

async function login(username, password) {
  let response = await request(app)
    .post("/login")
    .send({
      username,
      password
    });
  return response.body.token;
}

// before all test blocks
beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("POST /users/signup - post a unique new user should return response status 200", async () => {
  const response = await request(app)
    .post("/users/signup")
    .send(user01);
  expect(response.status).toBe(200);
});

// invalid signup - duplicate user
test("POST /signup - post a duplicate new user should return response status 500", async () => {
  const response = await request(app)
    .post("/users/signup")
    .send(user01);
  expect(response.status).toBe(500);
});

// invalid signup - no username
test("POST /signup - post a new user with no username should return response status 500", async () => {
  const response = await request(app)
    .post("/users/signup")
    .send(userNoUsername);
  expect(response.status).toBe(500);
});

// put route username found and changed
test("PUT /:username should return response 200", async () => {
  await signUpUser(user01.username, user01.password);
  const jwtToken = await login(user01.username, user01.password);

  const response = await request(app)
    .put(`/users/${user01.username}`)
    .send({
      username: user02.username,
      password: user02.password
    })
    .set("Authorization", "Bearer " + jwtToken);

  expect(response.status).toBe(200);
});

// put route login is neither authorised user nor admin
test("PUT /:username should return response 401", async () => {
  await signUpUser(user01.username, user01.password);
  await signUpUser(user02.username, user02.password);

  const jwtToken = await login(user01.username, user01.password);

  const response = await request(app)
    .put(`/users/${user02.username}`)
    .send({
      username: "newUsername"
    })
    .set("Authorization", "Bearer " + jwtToken);

  expect(response.status).toBe(401);
  expect(response.body.message).toBe(
    "You do not have the permission to view the details of other users"
  );
});
