const express = require('express')
const https = require('https')

// Create a new instance of express
const app = express()
const port = 4000;
app.use(express.json())

// If the currency code changes, calculate the exchange rate and send the results
function getCurrencyAndSend(res, prevCurrency, currency, assets, liabilities) {
    const requestURL = "https://api.exchangerate.host/convert?from=" + prevCurrency + "&to=" + currency;

    let rate = 1
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
function calculateAndSend(res, assets, liabilities, rate) {
    let net_worth = 0, total_assets = 0, total_liabilities = 0;

    for (let item in assets) {
        if (isNaN(assets[item])) {
            error = "Value at " + item + " is not a number"
            res.status(400).send(error);
            console.log(error)
            return;
        }
        total_assets += assets[item] * rate;
        assets[item] = (assets[item] * rate).toFixed(2);
    }

    for (let item in liabilities) {
        if (isNaN(liabilities[item])) {
            error = "Value at " + item + " is not a number"
            res.status(400).send(error);
            console.log(error)
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

async function run() {
  try {
    // Store the previous currency
    let prevCurrency = "CAD";

    app.get('/', (req, res) => {
        const currency = req.body.currency.toUpperCase();
        const assets = req.body.assets;
        const liabilities = req.body.liabilities;

        // If the currency changed, get exchange rate
        if (prevCurrency != currency) {
            prevCurrency = getCurrencyAndSend(res, prevCurrency, currency, assets, liabilities);
        } else {
            calculateAndSend(res, assets, liabilities, 1);
        }
        prevCurrency = currency
      });
    } catch {
        error => console.error(error);
    }
}

run().catch(console.dir);

// Tell app to listen on port 4000
app.listen(port, function (err) {
  if (err) {
    throw err;
  }

  console.log('Server started on port 4000');
})
