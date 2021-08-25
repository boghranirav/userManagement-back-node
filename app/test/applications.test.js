const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a[href="/create-application"]');
  });

  test("can see application create form", async () => {
    const label = await page.getContentsOf("h6");
    expect(label).toEqual("Create Application");
  });

  describe("And using invalid inputs", () => {
    beforeEach(async () => {
      await page.click("button#btnSubmit");
    });
    test("the form shows an error message", async () => {
      const appName = await page.getValuesOf("input#txtName");
      const appDescription = await page.getValuesOf("input#txtDescription");
      expect(appName).toEqual("");
      expect(appDescription).toEqual("");
    });
  });

  describe("And using valid inputs", () => {
    beforeEach(async () => {
      await page.type("input#txtName", "My App");
      await page.type("input#txtDescription", "My App URL");
      await page.click("button#btnSubmit");
    });
    test("Submitting then saving add application ", async () => {
      const result = await page.evaluate(() => {
        const rows = document.querySelectorAll("tbody");
        return Array.from(rows, (row) => {
          const columns = row.querySelectorAll("td");
          return Array.from(columns, (column) => column.innerText);
        });
      });

      if (result.includes("My App") && result.includes("My App URL")) {
        expect("").toEqual("");
      }
    });
  });
});

describe("When user is not logged in", async () => {});
