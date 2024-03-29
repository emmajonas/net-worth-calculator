import React from "react";
import "./NetWorthTable.css";

const NetWorthTable = ({ names, selectedCurrency, inputs, handleInputChange }) => {
    const tableData = (input, name) => Object.keys(input).map(key => {
        let value = "";
        if (key === "credit_card_1" || key === "credit_card_2" || key === "mortgage_1"
            || key === "mortgage_2" || key === "line_of_credit" || key === "investment_loan") {
            value = selectedCurrency.symbol + "0.00";
        }

        let title = "";
        if (key === "chequing") title = "Cash and Investments";
        else if (key === "primary_home") title = "Long Term Assets";
        else if (key === "credit_card_1") title = "Short Term Liabilities";
        else if (key === "mortgage_1") title = "Long Term Debt";

        return (
          <>
            {(key === "chequing" || key === "primary_home") && (
              <tr className="asset-rows">
                <td colSpan="2"><h5><code>{title}</code></h5></td>
                <td></td>
              </tr>
            )}
            {(key === "credit_card_1" || key === "mortgage_1") && (
              <tr className="liability-rows">
                <td><h5><code>{title}</code></h5></td>
                <td><h5><code>Monthly Payment</code></h5></td>
                <td></td>
              </tr>
            )}
            <tr className="input-data-row">
              <td><p>{names[name][key]}</p></td>
              <td>{value}</td>
              <td>{selectedCurrency.symbol} &nbsp;
                <input
                  type="number"
                  className="input-data"
                  id={key}
                  name={name}
                  value={input[key]}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
          </>
        );
      });

    return (
        <div className="net-worth" data-testid="net-worth">
          <table className="net-worth-table" data-testid="net-worth-table">
            <tbody>
              <tr>
                <td colSpan="2"><h3><code>Net Worth</code></h3></td>
                <td className={inputs.net_worth >= 0 ? "green": "red"}>{selectedCurrency.symbol} {inputs.net_worth}</td>
              </tr>
              <tr>
                <td colSpan="3"><h4><code>Assets</code></h4></td>
              </tr>
              {tableData(inputs.assets, "assets")}
              <tr>
                <td colSpan="2"><h4><code>Total Assets:</code></h4></td>
                <td className="green">{selectedCurrency.symbol} {inputs.total_assets}</td>
              </tr>
              <tr>
                <td colSpan="3"><h4><code>Liabilities</code></h4></td>
              </tr>
              {tableData(inputs.liabilities, "liabilities")}
              <tr>
                <td colSpan="2"><h4><code>Total Liabilities:</code></h4></td>
                <td className="red">{selectedCurrency.symbol} {inputs.total_liabilities}</td>
              </tr>
            </tbody>
          </table>
        </div>
    );
}

export default NetWorthTable;
