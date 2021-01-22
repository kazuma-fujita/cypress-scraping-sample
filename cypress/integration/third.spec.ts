describe("google search", () => {
  it("should perform basic google search", async () => {
    cy.visit("/");
    cy.get('[name="q"]').type("仙台青葉クリニック").type("{enter}");
    cy.wait(500);

    cy.get("[data-attrid=title]").should("have.text", "仙台青葉クリニック");

    cy.get("[data-attrid=title]").within((element: JQuery<HTMLElement>) => {
      cy.log(element[0].innerText);
    });
    cy.get("[data-async-trigger=reviewDialog]").within(
      (element: JQuery<HTMLElement>) => {
        cy.log("here", element[0].innerText);
      }
    );
  });
});
