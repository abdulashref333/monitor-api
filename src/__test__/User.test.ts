import { connect, connection } from "mongoose";
import supertest from "supertest";
import { app, startServer } from "../server";
const request = supertest(app);

describe.skip("User Test", () => {
  beforeAll(async () => {
    await startServer();
    await connect(`mongodb://localhost:27017/monitor-db-test`, {});
  });
  // successfull login
  test("Should Login successfully", done => {
    request
      .post("/api/users/signup")
      .send({
        name: "ahemd",
        email: "abdul.ashreff@gmail.com",
      })
      .end(function (err) {
        if (err) return done(err);
      });

    request
      .post("/api/users/login")
      .send({
        email: "abdul.ashreff@gmail.com",
        password: "P@ssw0rd",
      })
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.accessToken).not.toBeNull();
        done();
      });
  });
  // fail login
  test("Should fail after login with wrong data.", done => {
    request
      .post("/api/users/login")
      .send({
        email: "abdul.ashref333@gmail.com",
        password: "P@ssw0rd",
      })
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.accessToken).not.toBeNull();
        done();
      });
  });

  afterAll(async () => {
    await connection.db.collection("users").deleteMany({});
    await connection.close();
  });
});

export {};
