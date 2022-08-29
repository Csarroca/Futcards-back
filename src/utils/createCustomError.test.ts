import createCustomError from "./createCustomError";

describe("Given a createCustomError function", () => {
  let testError = createCustomError(
    404,
    "Can't find the resource",
    "This page is not available"
  );

  describe("When it is called with a code, a private and a public message, as an arguments", () => {
    test("Then it  should return an error with the property status code equal to the argument 'code'", () => {
      const status = 404;
      expect(testError.statusCode).toBe(status);
    });

    test("Then it should return an error with message equal to the argument 'public message'", () => {
      const message = "This page is not available";

      expect(testError.errorMessage).toBe(message);
    });
  });

  describe("When called with a code and a private message as arguments", () => {
    test("Then it should return an error with the message equal to the argument 'private message'", () => {
      testError = createCustomError(404, "Can't find the resource");
      const message = "Can't find the resource";

      expect(testError.errorMessage).toBe(message);
    });
  });
});
