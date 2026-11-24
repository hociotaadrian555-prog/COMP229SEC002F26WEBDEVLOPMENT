
describe("Portfolio Login Page E2E Tests", () => {

    beforeEach(() => {
        cy.visit("http://localhost:5173/login");
    });

    it("should display the Welcome Back heading", () => {
        cy.contains("h1", "Welcome Back").should("be.visible");
    });

    it("should display the email and password fields", () => {
        cy.get('input[type="email"]').should("be.visible");
        cy.get('input[type="password"]').should("be.visible");
    });

    it("should display the Login button", () => {
        cy.contains("button", "Login").should("be.visible");
    });

});
