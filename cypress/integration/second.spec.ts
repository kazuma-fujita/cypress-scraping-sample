describe("google search", () => {
  it("should perform basic google search", () => {
    cy.visit("/");
    cy.get('[name="q"]').type("Hello world").type("{enter}");
  });
});
