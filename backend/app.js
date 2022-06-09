'use strict';

const express = require("express");
const app = express();
const https = require("https");

app.use(express.json());

// If the currency code changes, calculate the exchange rate and send the results
const getRateAndSend = (res, prevCurrency, currency, assets, liabilities) => {
    const requestURL = "https://api.exchangerate.host/convert?from=" + prevCurrency + "&to=" + currency;

    let rate = 1;
    https.get(requestURL, response => {
        var body = "";
        response.on("data", chunk => {
            body += chunk;
        });

        response.on("end", () => {
            let jsonbody = JSON.parse(body)
            rate = jsonbody.result;

            if (rate == null) {
                res.status(400).send("Invalid currency code");
                return;
            }

            calculateAndSend(res, assets, liabilities, rate);
        });
    }).on("error", e => { console.error(e) });
}

// Calculate the totals and send the results
const calculateAndSend = (res, assets, liabilities, rate) => {
    let net_worth = 0, total_assets = 0, total_liabilities = 0;

    for (let item in assets) {
        if (isNaN(assets[item])) {
            const error = "Value at " + item + " is not a number";
            res.status(400).send(error);
            console.log(error);
            return;
        }
        total_assets += assets[item] * rate;
        assets[item] = (assets[item] * rate).toFixed(2);
    }

    for (let item in liabilities) {
        if (isNaN(liabilities[item])) {
            const error = "Value at " + item + " is not a number";
            res.status(400).send(error);
            console.log(error);
            return;
        }
        total_liabilities += liabilities[item] * rate;
        liabilities[item] = (liabilities[item] * rate).toFixed(2);
    }

    net_worth = (total_assets - total_liabilities).toFixed(2);
    total_assets = total_assets.toFixed(2);
    total_liabilities = total_liabilities.toFixed(2);

    let obj = { "net_worth": net_worth,
                "total_assets": total_assets,
                "total_liabilities": total_liabilities,
                "assets": assets,
                "liabilities": liabilities
                };

    console.log(obj);
    res.status(200).send(JSON.stringify(obj));
}

app.post('/', (req, res) => {
    console.log(req.body)
    let currency = req.body.currency;
    let prevCurrency = req.body.previous_currency;
    const assets = req.body.assets; const liabilities = req.body.liabilities;
    if (currency === undefined || prevCurrency === undefined
        || assets === undefined || liabilities === undefined) {
        const error = "Invalid request body";
        res.status(400).send(error);
    }
    currency = currency.toUpperCase();
    prevCurrency = prevCurrency.toUpperCase();

    // If the currency changed, get exchange rate
    if (prevCurrency !== currency) {
        getRateAndSend(res, prevCurrency, currency, assets, liabilities);
    } else {
        calculateAndSend(res, assets, liabilities, 1);
    }
});

module.exports = app;
