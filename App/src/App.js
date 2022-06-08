import React, { useState } from 'react';
import './App.css';
import SelectCurrency from './SelectCurrency';
import { currencies } from './currencies';
import { inputs, names } from "./inputs";
import { getNewTotals } from "./NetWorthService";
import NetWorthTable from './NetWorthTable';

// to do
// test cases

function App() {
  const [state, setState] = useState({ 
    selectedCurrency: currencies[0],
    previousCurrency: currencies[0],
    inputs: inputs,
    showError: false
  });
  const [timer, setTimer] = useState(null);

  // When a user changes a value in the table
  const handleInputChange = (event) => {
    const value = event.target.value;
    const key = event.target.id;
    const name = event.target.name;

    setState({
      ...state,
      inputs: { ...state.inputs, [name]: {...state.inputs[name], [key]: value }},
      showError: false
    });

    // Ensure the most up-to-date values are passed to the backend
    let assets = state.inputs["assets"];
    let liabilities = state.inputs["liabilities"];
    if (name === "assets") assets = { ...assets, [key]: value };
    else liabilities = { ...liabilities, [key]: value };

    // Ensure totals update only after the user finishes typing
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      const currency = state.selectedCurrency;
      getNewTotals({
        currency: currency.code,
        previous_currency: state.previousCurrency.code,
        assets,
        liabilities
      }).then(response => {
          if (response !== [] && response !== undefined
            && response != null && !(response instanceof Error)) {
            setState({ ...state, inputs: response, previousCurrency: currency });
          } else {
            // Display error message if the request fails
            setState({ ...state, showError: true});
          }
      });
    }, 750);

    setTimer(newTimer);
  };

  // When a user changes the currency
  const handleCurrencyChange = (currency) => {
    setState({ ...state, showError: false });
    getNewTotals({
      currency: currency.code,
      previous_currency: state.selectedCurrency.code,
      assets: state.inputs["assets"],
      liabilities: state.inputs["liabilities"]
    }).then(response => {
        if (response !== [] && response !== undefined
          && response !== null && !(response instanceof Error)) {
          setState({
            ...state,
            selectedCurrency: currency,
            previousCurrency: currency,
            inputs: response
          });
        } else {
          // Display error message if the request fails
          setState({ ...state, showError: true });
        }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <code>Net Worth Calculator</code>
        </h1>
      </header>
      <div className="container">
        <div className="select-currency">
          <p className="currency-label">Select currency:</p>
          <SelectCurrency 
            selectedCurrency={state.selectedCurrency}
            handleCurrencyChange={handleCurrencyChange}
            currencies={currencies}
          />
          {state.showError && (
            <div className="error-message">
              <h5>An error occured while fetching data</h5>
            </div>
          )}
        </div>
        <NetWorthTable
          names={names}
          selectedCurrency={state.selectedCurrency}
          inputs={state.inputs}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
}

export default App;
