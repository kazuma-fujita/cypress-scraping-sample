const SCROLL_DURATION = 1000;
const WAIT_TIME = 500;

context("Google review search.", () => {
  it("Do a Google search to get all reviews.", () => {
    // fixtures/search_keywords.jsonから検索キーワードを一覧を取得
    cy.fixture("search_keywords").then(
      (jsonData: { keywords: Array<string> }) => {
        jsonData.keywords.map((keyword) => {
          cy.visit("/");
          // Googleキーワード検索
          cy.get('[name="q"]').type(keyword).type("{enter}");
          // 検索結果表示までNms待機
          cy.wait(WAIT_TIME);
          // 「Googleのクチコミ」リンクを検索
          cy.get("[data-async-trigger=reviewDialog]").each(
            (element: JQuery<HTMLElement>, index: number) => {
              // 検索結果画面内のリンクが複数ある為、最初に取得したリンクをクリック
              if (index === 0) {
                cy.wrap(element).click({ force: true });
                // クチコミ一覧ダイアログが表示されるまでNms待機
                cy.wait(WAIT_TIME);
                // 「Googleのクチコミ（n）」のクチコミ数nを取得
                const reviewCounts = element[0].innerText
                  .toString()
                  .match(/\d+/) as RegExpMatchArray;
                // クチコミ全件表示の為、review数を10で割って四捨五入繰り上げ数分loop
                const loopCount = Math.ceil(parseInt(reviewCounts[0], 10) / 10);
                // クチコミダイアログのクチコミを全件表示するまでscroll
                Array(loopCount)
                  .fill(0)
                  .forEach(() => {
                    cy.get(".review-dialog-list").scrollTo("bottom", {
                      duration: SCROLL_DURATION,
                    });
                    cy.wait(WAIT_TIME);
                  });
                // クチコミダイアログの画面内に表示されている「もっと見る」リンクを全てクリック
                cy.get(".review-more-link").each(
                  (childElement: JQuery<HTMLElement>) => {
                    cy.wrap(childElement).click();
                  }
                );
                // クチコミを表示分全て取得
                cy.get(".gws-localreviews__google-review").each(
                  (childElement: JQuery<HTMLElement>) => {
                    cy.log(childElement[0].innerText);
                  }
                );
              }
            }
          );
        });
      }
    );
  });
});
