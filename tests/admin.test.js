const request = require("supertest");
const User = require("../models/user");

// const express = require("express");

// const adminRouter = require("../routes/admin");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = require("../app");
// const router = express();
// adminRouter(router);

// before all test blocks
async function signUp(username, password, isAdmin) {
  await request(app)
    .post("/users/signup")
    .send({
      username,
      password,
      isAdmin
    });
}

async function loginUser(username, password) {
  let response = await request(app)
    .post("/users/login")
    .send({
      username,
      password
    });
  return response.body.token;
}

beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("GET /users should return status 200 for admin", async () => {
  await signUp("admin01", "password01", true);
  const jwtToken = await loginUser("admin01", "password01");
  const response = await request(app)
    .get("/admin/users")
    .set("Authorization", "Bearer " + jwtToken);
  expect(response.status).toBe(200);
});

test("GET /users should return status 401 for non admin", async () => {
  await signUp("user01", "password01", false);
  const jwtToken = await loginUser("user01", "password01");
  const response = await request(app)
    .get("/admin/users")
    .set("Authorization", "Bearer " + jwtToken);
  expect(response.status).toBe(401);
  expect(response.body.errors.message).toBe("User is not an admin");
});

test("DELETE /users should return status 200 for admin", async () => {
  await signUp("admin01", "password01", true);
  await signUp("user01", "password01", false);
  const jwtToken = await loginUser("admin01", "password01");
  const userToDelete = await User.findOne({ username: "user01" });
  const idToDelete = userToDelete._id;

  const response = await request(app)
    .delete(`/admin/${idToDelete}`)
    .set("Authorization", "Bearer " + jwtToken);
  expect(response.status).toBe(200);
  expect(response.body.message).toBe(`user ${idToDelete} has been deleted`);
});

test("DELETE /users should return status 401 for non admin", async () => {
  await signUp("user01", "password01", false);
  await signUp("user02", "password02", false);
  const jwtToken = await loginUser("user02", "password02");
  const response = await request(app)
    .get("/admin/users")
    .set("Authorization", "Bearer " + jwtToken);
  expect(response.status).toBe(401);
  expect(response.body.errors.message).toBe("User is not an admin");
});
