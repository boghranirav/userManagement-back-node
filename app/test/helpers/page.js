const puppeteer = require("puppeteer");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    await this.page.evaluate(() => {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbF9pZCI6ImJvZ2hyYW5pcmF2MDAxQGdtYWlsLmNvbSIsImRlc2lnbmF0aW9uX2lkIjoxLCJsb2dfaWQiOjI1MiwiaWF0IjoxNjI5ODcxMTcxLCJleHAiOjE2Mjk4OTk5NzF9.03ZZGRzlIxFMwM7ElGRUWGWM_4WgEcC2uA6-z-jEPkQ",
          expiration: "2021-08-26T11:23:46.707Z",
        })
      );
    });
    await this.page.goto("http://localhost:3000/");
    await this.page.waitForSelector('a[href="/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  async getValuesOf(selector) {
    return this.page.$eval(selector, (el) => el.value);
  }
}

module.exports = CustomPage;
