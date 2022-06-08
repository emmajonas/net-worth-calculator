const server = require("./server.js");
const supertest = require("supertest")
const requestWithSupertest = supertest(server);

const mockReq = {
    currency: "CAD",
    prevCurrency: "CAD",
    assets: {
        chequing: 2000.00,
        savings_for_taxes: 4000.00,
        rainy_day_fund: 506.00,
        savings_for_fun: 5000.00,
        savings_for_travel: 400.00,
        savings_for_personal_development: 200.00,
        investment_1: 5000.00,
        investment_2: 60000.00,
        investment_3: 24000.00,
        primary_home: 455000.00,
        second_home: 1564321.00,
        other: 0.00
    },
    liabilities: {
        credit_card_1:  4342.00,
        credit_card_2: 322.00,
        mortgage_1: 250999.00,
        mortgage_2: 632634.00,
        line_of_credit: 10000.00,
        investment_loan: 10000.00
    }
};

const mockRes = {
    net_worth: 1212130.00,
    total_assets: 2120427.00,
    total_liabilities: 908297.00,
    assets: mockReq.assets,
    liabilities: mockReq.liabilities
}

describe("endpoints", () => {
    test("POST / show return calculated totals", async () => {
        const res = await requestWithSupertest.post("/");
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining("json"));
        expect(res.body).toEqual(JSON.stringify(mockRes));
        done();
    });
});
