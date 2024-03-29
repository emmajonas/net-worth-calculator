import React, { useState } from 'react';
import "./SelectCurrency.css";

const SelectCurrency = ({ selectedCurrency, handleCurrencyChange, currencies }) => {
    const [open, setOpen] = useState(false);

    const handleChange = (currency) => {
        handleCurrencyChange(currency);
        setOpen(false);
    };

    return (
        <div className="dropdown" data-testid="dropdown">
            <div
                tabIndex={0}
                className="d-header"
                data-testid="d-header"
                role="button"
                onKeyPress={() => setOpen(!open)}
                onClick={() => setOpen(!open)}>
                <div className="d-header_title" data-testid="d-header_title">
                    <p className="d-header_title--bold">
                        {"\u25BC " + selectedCurrency.code}
                    </p>
                </div>
            </div>
            { open && (
                <ul className="d-list" data-testid="d-list">
                    {currencies.map(currency => (
                        <li className="d-list-item" data-testid={"d-list-item-" + currency.code} key={currency.code}>
                            <button type="button" onClick={() => handleChange(currency)}>
                                <span>{currency.code}</span>
                                <span>
                                    {selectedCurrency.code === currency.code && " \u2713"}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SelectCurrency;
