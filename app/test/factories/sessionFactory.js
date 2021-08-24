module.exports = () => {
  const session = JSON.stringify({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbF9pZCI6ImJvZ2hyYW5pcmF2MDAxQGdtYWlsLmNvbSIsImRlc2lnbmF0aW9uX2lkIjoxLCJsb2dfaWQiOjI1MSwiaWF0IjoxNjI5ODAzMDAwLCJleHAiOjE2Mjk4MzE4MDB9.ooK3Nw89X6Dkw-m29VEq7j7XxOcXW8-q6W88REH8CEo",
    expiration: "2021-08-24T11:23:46.707Z",
  });

  //   await page.evaluate(() => {
  //     localStorage.setItem("userData", session);
  //   });
  console.log("From Session=>", session);
  return session;
};
