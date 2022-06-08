import React, { useState } from 'react';
import './App.css';
import SelectCurrency from './SelectCurrency';
import { currencies } from './currencies';
import { inputs, names } from "./inputs";
import { getNewTotals } from "./NetWorthService";
import NetWorthTable from './NetWorthTable';

// to do
// add error message if server is down
// test cases

function App() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [previousCurrency, setPreviousCurrency] = useState(currencies[0]);
  const [inputState, setInputState] = useState(inputs);
  const [showError, setShowError] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleInputChange = (event) => {
    const value = event.target.value;
    const key = event.target.id;
    const name = event.target.name
    // add error messaging on screen
    setShowError(false)
    setInputState({ ...inputState, [name]: {...inputState[name], [key]: value}});

    let assets = inputState["assets"];
    let liabilities = inputState["liabilities"];
    if (name === "assets") {
      assets = { ...assets, [key]: value }
    } else {
      liabilities = { ...liabilities, [key]: value }
    }

    // ensure totals update only after the user finishes typing
    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      const currency = selectedCurrency
      getNewTotals({ currency: currency.code, previous_currency: previousCurrency.code, assets, liabilities })
        .then(response => {
          if (response !== [] && response !== undefined && response != null && !(response instanceof Error)) {
            setInputState(response)
            setPreviousCurrency(currency)
          } else {
            setShowError(true)
          }
      });
    }, 500);

    setTimer(newTimer)
  };

  const handleCurrencyChange = (currency) => {
    setShowError(false)
    getNewTotals({currency: currency.code, previous_currency: selectedCurrency.code, assets: inputState["assets"], liabilities: inputState["liabilities"]})
      .then(response => {
        if (response !== [] && response !== undefined && response !== null && !(response instanceof Error)) {
          setInputState(response)
          setPreviousCurrency(currency)
          setSelectedCurrency(currency)
        } else {
          setShowError(true)
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
            selectedCurrency={selectedCurrency}
            handleCurrencyChange={handleCurrencyChange}
            currencies={currencies} />
        </div>
        <NetWorthTable
          names={names}
          selectedCurrency={selectedCurrency}
          inputState={inputState}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
}

export default App;
