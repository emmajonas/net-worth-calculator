import React from "react";
import { render, fireEvent, screen } from '@testing-library/react';
import SelectCurrency from './SelectCurrency';
import { currencies } from "./currencies";

describe("SelectCurrency", () => {
    const mount = () => render(
        <SelectCurrency 
            selectedCurrency={currencies[0]}
            handleCurrencyChange={() => {}}
            currencies={currencies}
        />
    );

    it("renders currency selector", () => {
        const { container } = mount();
        expect(screen.getByTestId("dropdown")).toBeInTheDocument();
        expect(screen.getByTestId("d-header")).toBeInTheDocument();
        expect(screen.getByTestId("d-header_title")).toHaveTextContent(currencies[0].code);
        expect(screen.queryByTestId("d-list")).toBeNull();
        expect(container.getElementsByClassName("d-list-item").length).toBe(0);
    });

    it("renders the dropdown list when clicked", () => {
        const { container } = mount();
        const button = screen.getByTestId("d-header_title");
        fireEvent.click(button);

        expect(screen.getByTestId("d-list")).toBeInTheDocument();
        expect(container.getElementsByClassName("d-list-item").length).toBe(currencies.length);
        expect(screen.getByTestId("d-list-item-" + currencies[0].code)).toHaveTextContent(currencies[0].code + " \u2713")
    });

    it("closes dropdown list on second click", async () => {
        mount();
        const button = screen.getByTestId("d-header_title");
        fireEvent.doubleClick(button);
        expect(screen.queryByTestId("d-list")).toBeNull();
    });
});
