/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/server/index.ts",
    "!src/database/model/users.ts",
    "!src/database/index.ts",
    "!src/loadEnvironment.ts",
    "!src/routters/usersRouter.ts",
  ],
};
