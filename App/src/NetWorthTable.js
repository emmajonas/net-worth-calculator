import React from "react";
import "./NetWorthTable.css";

const NetWorthTable = ({ names, selectedCurrency, inputState, handleInputChange }) => {
    const tableData = (input, name) => Object.keys(input).map(key => {
        return (
            <tr>
              <td><p>{names[name][key]}</p></td>
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
        );
      });

    return (
        <div className="net-worth">
          <table className="net-worth-table">
            <tbody>
              <tr>
                <td><h3>Net Worth</h3></td>
                <td className="green">{selectedCurrency.symbol} {inputState.net_worth}</td>
              </tr>
              <tr><td colSpan="2"><h4>Assets</h4></td></tr>
              {tableData(inputState.assets, "assets")}
              <tr><td><h4>Total Assets:</h4></td><td className="green">{selectedCurrency.symbol} {inputState.total_assets}</td></tr>
              <tr><td colSpan="2"><h4>Liabilities</h4></td></tr>
              {tableData(inputState.liabilities, "liabilities")}
              <tr><td><h4>Total Liabilities:</h4></td><td className="green">{selectedCurrency.symbol} {inputState.total_liabilities}</td></tr>
            </tbody>
          </table>
        </div>
    );
}

export default NetWorthTable;
