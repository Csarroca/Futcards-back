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
      const user = { userName: "Paco", password: "paco12345" };
      const expectedStatus = 201;

      const response = await request(app)
        .post("/users/register")
        .send(user)
        .expect(expectedStatus);
      expect(response.statusCode).toEqual(expectedStatus);
    });
  });
  describe("When it receives a request without password", () => {
    test("Then it should response with status 400 and a message 'Wrong data'", async () => {
      const message = "Wrong data";
      const { body } = await request(app)
        .post("/users/register")
        .send({
          userName: "paco",
        })
        .expect(400);

      expect(body).toHaveProperty("error", message);
    });
  });
});
