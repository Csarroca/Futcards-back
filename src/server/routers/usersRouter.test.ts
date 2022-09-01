import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../index";
import connectDB from "../../dataBase/index";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const mongoURL = server.getUri();

  await connectDB(mongoURL);
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

describe("Given the  endpoint /users/register with method POST", () => {
  describe("When it receives a request with userName 'Paco' and password 'paco123'", () => {
    test("Then it should response with status 201 and the user data", async () => {
      const user = { userName: "Paco", password: "paco123" };
      const expectedStatus = 201;

      const response = await request(app)
        .post("/users/register")
        .send(user)
        .expect(expectedStatus);
      expect(response.statusCode).toEqual(expectedStatus);
    });
  });
});
