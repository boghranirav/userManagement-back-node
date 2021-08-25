const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("Correct text -> page Login -> Text login", async () => {
  const text = await page.getContentsOf("h6.m-0");
  expect(text).toEqual("Login");
});

// test("clicking login starts flow.", async () => {
//   await page.click("button");
//   const url = await page.url();
// }, 12000);

test("When sign In, shows logout button", async () => {
  await page.login();
  const text = await page.getContentsOf('a[href="/logout"] span');
  expect(text).toEqual("Logout");
});
