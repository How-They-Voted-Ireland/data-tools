const fs = require("fs");
const puppeteer = require("puppeteer");

const url =
  "https://www.oireachtas.ie/en/debates/votes/?datePeriod=dates&voteResultType=all&debateType=dail&toDate=02%2F08%2F2020&fromDate=01%2F01%2F2020&resultsPerPage=100";

// { slowMo: 500, headless: false }

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(async () => {
    const voteSections = Array.from(
      document.querySelectorAll("div.c-votes-list div.c-votes-list__item")
    );
    let voteDetails = [];

    for (let section of voteSections) {
      const voteDetailUrl = section
        .querySelector(".c-votes-list__link")
        .getAttribute("href");

      voteDetails.push({
        date: section.querySelector(".c-votes-list__date").innerHTML.trim(),
        house: section.querySelector(".c-votes-list__house").innerHTML.trim(),
        title: section.querySelector(".c-votes-list__title").innerHTML.trim(),
        description: section.querySelector(".c-votes-list__description")
          .innerHTML,
        status: section.querySelector(".c-votes-list__status").innerHTML.trim(),
        detailLink: voteDetailUrl,
      });
    }

    return voteDetails;
  });

  for (let item of data) {
    const link = `https://www.oireachtas.ie${item.detailLink}`;
    await page.goto(link);

    await page.click(".c-vote-detail-toggle__link");

    item.voteDetails = await page.evaluate(() => {
      const resultsSection = Array.from(
        document.querySelectorAll(".c-vote-detail-voters-list__result")
      );

      return resultsSection.map((result) => {
        const membersList = Array.from(
          result.querySelectorAll(".c-vote-detail-voters-list__member ")
        );
        const members = membersList.map((member) => ({
          fullName: member
            .querySelector(".c-vote-detail-voters-list__member-link")
            .innerHTML.trim(),
          link: member
            .querySelector(".c-vote-detail-voters-list__member-link")
            .getAttribute("href"),
        }));

        return {
          members,
          choice: result
            .querySelector(".c-vote-detail-voters-list__sub-title")
            .innerHTML.trim(),
        };
      });
    });
  }

  await browser.close();

  const result = JSON.stringify(data, null, 2);

  console.log(result);
  fs.writeFileSync(
    "../scraped-data/33-dail-votes-01012020-02082020.js",
    result
  );
})();
