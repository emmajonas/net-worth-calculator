const server = require("./app");
const close = require("./server.js");
const supertest = require("supertest");
const sinon = require("sinon");
const requestWithSupertest = supertest(server);

const mockReq = {
    currency: "CAD",
    previous_currency: "CAD",
    assets: {
        chequing: "2000.00",
        savings_for_taxes: "4000.00",
        rainy_day_fund: "506.00",
        savings_for_fun: "5000.00",
        savings_for_travel: "400.00",
        savings_for_personal_development: "200.00",
        investment_1: "5000.00",
        investment_2: "60000.00",
        investment_3: "24000.00",
        primary_home: "455000.00",
        second_home: "1564321.00",
        other: "0.00"
    },
    liabilities: {
        credit_card_1:  "4342.00",
        credit_card_2: "322.00",
        mortgage_1: "250999.00",
        mortgage_2: "632634.00",
        line_of_credit: "10000.00",
        investment_loan: "10000.00"
    }
};

const mockRes = {
    net_worth: "1212130.00",
    total_assets: "2120427.00",
    total_liabilities: "908297.00",
    assets: mockReq.assets,
    liabilities: mockReq.liabilities
}

describe("POST /", () => {
    it("returns calculated totals", async () => {
        const res = await requestWithSupertest
            .post("/")
            .set("Content-Type", "application/json")
            .send(mockReq);

        expect(res.status).toEqual(200);
        expect(res.text).toEqual(JSON.stringify(mockRes));
        close();
    });

    it("returns an error if an invalid request body is passed", async () => {
        const res = await requestWithSupertest
            .post("/")
            .set("Content-Type", "application/json");

        expect(res.status).toEqual(400);
        expect(res.text).toEqual("Invalid request body");
        close();
    });

    it("returns an error if an invalid currency is passed", async () => {
        let sinonServer = sinon.fakeServer.create();
        sinonServer.respondWith(
            "GET",
            "https://api.exchangerate.host/convert?from=XYZ&to=CAD",
            [200, { "Content-Type": "application/json" }, JSON.stringify({ rate: null })]
        );
        sinonServer.autoRespond = true
        const res = await requestWithSupertest
            .post("/")
            .set("Content-Type", "application/json")
            .send({ ... mockReq, currency: "XYZ"});

        expect(res.status).toEqual(400);
        expect(res.text).toEqual("Invalid currency code");
        close();
        sinonServer.restore();
    });

    it("returns an error if an invalid number is given", async () => {
        const res = await requestWithSupertest
            .post("/")
            .set("Content-Type", "application/json")
            .send({ ... mockReq, assets: { ...mockReq.assets, chequing: "NaN"}});
        
        expect(res.status).toEqual(400);
        expect(res.text).toEqual("Value at chequing is not a number");
        close();
    });
});
