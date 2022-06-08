import React from "react";
import { render, screen } from '@testing-library/react';
import App from "./App";
import { currencies } from "./currencies";

describe("App", () => {
    it("renders the home page", async () => {
        render(<App />);

        expect(screen.getByTestId("App")).toBeInTheDocument();
        expect(screen.getByTestId("App-header")).toHaveTextContent("Net Worth Calculator");
        expect(screen.getByTestId("container")).toBeInTheDocument();
        expect(screen.getByTestId("select-currency")).toBeInTheDocument();
        expect(screen.getByTestId("select-currency")).toHaveTextContent(currencies[0].code);
        expect(screen.getByTestId("net-worth-table")).toBeInTheDocument();
        expect(screen.getByTestId("net-worth-table")).toHaveTextContent(currencies[0].symbol);
    });
});