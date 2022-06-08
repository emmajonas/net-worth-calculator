import React from "react";
import { render, screen } from '@testing-library/react';
import { inputs, names } from "./inputs";
import NetWorthTable from "./NetWorthTable";
import { currencies } from "./currencies";

describe("NetWorthTable", () => {
    const mount = (currency = currencies[0]) => render(
        <NetWorthTable 
            names={names}
            selectedCurrency={currency}
            inputs={inputs}
            handleInputChange={() => {}}
        />
    );

    it("renders the net worth table", () => {
        const { container } = mount();

        expect(screen.getByTestId("net-worth")).toBeInTheDocument();
        expect(screen.getByTestId("net-worth-table")).toBeInTheDocument();
        expect(container.getElementsByClassName("input-data-row").length).toBe(18);
        expect(container.getElementsByClassName("input-data").length).toBe(18);
        expect(container.getElementsByClassName("asset-rows").length).toBe(2);
        expect(container.getElementsByClassName("liability-rows").length).toBe(2);
        expect(container.getElementsByClassName("green").length).toBe(3);
        expect(container.getElementsByClassName("green")[0]).toHaveTextContent(currencies[0].symbol);
        expect(container.getElementsByClassName("input-data-row")[0]).toHaveTextContent(currencies[0].symbol);
    });

    it("displays the correct currency symbol", async () => {
        const { container } = mount(currencies[2]);

        expect(container.getElementsByClassName("green")[0]).toHaveTextContent(currencies[2].symbol);
        expect(container.getElementsByClassName("input-data-row")[0]).toHaveTextContent(currencies[2].symbol);
    });
});
