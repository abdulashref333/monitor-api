import client from "../../config/redis";
import { getAllRedisKeys, getValuesByKey } from "../../utils/redis";

jest.setTimeout(5000);
describe.skip("Test Redis Utils", () => {
  beforeAll(async () => {
    // just filling a dummy data.
    client.connect();
    await client.lPush("check:6352ab77f222e437da0cdf39", "check something.");
    await client.lPush("check:6352abc14d2dfd9836c2e2e3", "check something.");
  });

  test("Should getAllKeys successfully", done => {
    getAllRedisKeys().then(res => {
      expect(res).toBeInstanceOf(Array);
      expect(res?.length).toEqual(2);
      done();
    });
  });

  test("Should getValuesByKey successfully", done => {
    getValuesByKey("check:6352ab77f222e437da0cdf39").then(res => {
      expect(res?.length).toEqual(1);
      expect(res![0]).toContain("check");
      done();
    });
  });

  test("Should return nothing with wrong key", done => {
    getValuesByKey("").then(res => {
      expect(res?.length).toEqual(0);
      done();
    });
  });

  afterAll(async () => {
    await client.FLUSHDB();
    await client.quit();
  });
});
