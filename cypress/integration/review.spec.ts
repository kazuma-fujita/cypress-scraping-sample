const SCROLL_DURATION = 1000;
const WAIT_TIME = 500;

describe("google search", () => {
  it("should perform review google search", () => {
    cy.visit("/");
    // Googleキーワード検索
    cy.get('[name="q"]').type("ラーメン二郎立川店").type("{enter}");
    // 検索結果表示まで1s待機
    cy.wait(WAIT_TIME);
    // 「Googleのクチコミ」リンクを検索
    cy.get("[data-async-trigger=reviewDialog]").each(
      (element: JQuery<HTMLElement>, index: number) => {
        // 検索結果画面内のリンクが複数ある為、最初に取得したリンクをクリック
        if (index === 0) {
          cy.wrap(element).click({ force: true });
          // クチコミ一覧ダイアログが表示されるまで1s待機
          cy.wait(WAIT_TIME);
          // n回loop
          Array(10)
            .fill(0)
            .forEach(() => {
              // クチコミダイアログのクチコミ一覧をscroll
              cy.get(".review-dialog-list").scrollTo("bottom", {
                duration: SCROLL_DURATION,
              });
              cy.wait(WAIT_TIME);
            });
          // クチコミダイアログの画面内に表示されている「もっと見る」リンクを全てクリックする
          cy.get(".review-more-link").each(
            (childElement: JQuery<HTMLElement>) => {
              cy.wrap(childElement).click();
            }
          );
          // クチコミを表示分全て取得する
          cy.get(".gws-localreviews__google-review").each(
            (childElement: JQuery<HTMLElement>) => {
              cy.log(childElement[0].innerText);
            }
          );
        }
      }
    );
  });
});
