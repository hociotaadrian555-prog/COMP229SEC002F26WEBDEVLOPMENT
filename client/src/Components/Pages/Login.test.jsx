
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

describe("Login Page Unit Tests", () => {

    it("should display the Welcome Back heading", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("heading", { name: /welcome back/i })
        ).toBeInTheDocument();
    });

    it("should display the email and password fields", () => {
        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(
            container.querySelector('input[type="email"]')
        ).toBeInTheDocument();

        expect(
            container.querySelector('input[type="password"]')
        ).toBeInTheDocument();
    });

    it("should display the Login button", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("button", { name: /login/i })
        ).toBeInTheDocument();
    });

});
