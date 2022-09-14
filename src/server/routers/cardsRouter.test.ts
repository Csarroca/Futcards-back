import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../index";
import connectDB from "../../dataBase/index";
import Card from "../../dataBase/models/cards";
import mockedCard from "../../test-utils/mocks/mockCard";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMTVhNGQxNjE2MmQyYTI1YTg5YTQyZSIsInVzZXJOYW1lIjoiYWRtaW4iLCJpYXQiOjE2NjIzNzk2MDJ9.6PV-5iNAEeYwnznTrmJo93iUfpB-5vk2_-62JfU0etU";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const mongoURL = server.getUri();

  await connectDB(mongoURL);
});

beforeEach(async () => {
  await Card.create(mockedCard);
});

afterEach(async () => {
  await Card.deleteMany({});
});

afterAll(async () => {
  await Card.deleteMany({});
  await mongoose.connection.close();
  await server.stop();
});

describe("Given a cardsRouter", () => {
  describe("When it receives a request on  path /cards", () => {
    test("It should call the getAllCards controller function and return an array with 1 card and the status 200", async () => {
      const { body } = await request(app)
        .get("/cards")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toHaveLength(1);
    });
  });
});
