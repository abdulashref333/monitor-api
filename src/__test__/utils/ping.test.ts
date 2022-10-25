import ping from "../../utils/ping";
import { IResponse } from "../../models/interfaces";

jest.setTimeout(3000);
describe.skip("Test Ping Utils", () => {
  // successfull scenario.
  test("Should return success after ping lipsum", done => {
    ping("https://www.lipsum.com/", 2000).then(res => {
      expect(res).toBeInstanceOf(Object);
      expect(res.isSuccess).toBeTruthy();
      expect(res.resTime).toBeGreaterThanOrEqual(0);
      expect(res.Timestamped).toBeInstanceOf(Date);
      done();
    });
  });

  test("Should fail after ping wrong url.", done => {
    ping("https://www.lipsum.come/", 2000).then(res => {
      expect(res).toBeInstanceOf(Object);
      expect(res.isSuccess).toBeFalsy();
      expect(res.resTime).toBeGreaterThanOrEqual(0);
      expect(res.Timestamped).toBeInstanceOf(Date);
      done();
    });
  });
});
