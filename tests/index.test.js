const request = require("supertest");
const express = require("express");

const indexRouter = require("../routes/index");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = express();
indexRouter(app);

// before all test blocks
beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
  // await seed data here
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("GET /", async () => {
  const response = await request(app).get("/");
  expect(response.status).toBe(200);
});
