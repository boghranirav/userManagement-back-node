const puppeteer = require("puppeteer");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("Correct text -> page Login -> Text login", async () => {
  const text = await page.$eval("h6.m-0", (el) => el.innerHTML);

  expect(text).toEqual("Login");
});

// test("clicking login starts flow.", async () => {
//   await page.click("button");
//   const url = await page.url();
// }, 12000);

test("When sign In, shows logout button", async () => {
  await page.evaluate(() => {
    localStorage.setItem(
      "userData",
      JSON.stringify({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbF9pZCI6ImJvZ2hyYW5pcmF2MDAxQGdtYWlsLmNvbSIsImRlc2lnbmF0aW9uX2lkIjoxLCJsb2dfaWQiOjI1MSwiaWF0IjoxNjI5ODAzMDAwLCJleHAiOjE2Mjk4MzE4MDB9.ooK3Nw89X6Dkw-m29VEq7j7XxOcXW8-q6W88REH8CEo",
        expiration: "2021-08-26T11:23:46.707Z",
      })
    );
  });

  await page.goto("http://localhost:3000/dashboard");
  await page.waitFor('a[href="/logout"]');

  const text = await page.$eval('a[href="/logout"]', (el) => el.innerHTML);

  expect(text).toEqual("<span>Logout</span>");
});
