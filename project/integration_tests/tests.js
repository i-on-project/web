'use strict'

const cheerio = require('cheerio');

// TO DO - This is an early version of the integration tests - We're still experimenting

test("Default Meta Charset", () => {
    //expect.assertions(1);
    return get("/").then(data => {
        const $ = cheerio.load(data);
        expect($("head [charset]").attr("charset")).toBe("utf-8");
    });
});

test("CSS Style", () => {
    //expect.assertions(1);
    return get("/").then(data => {
        const $ = cheerio.load(data);
        expect(
        $('head [rel="stylesheet"]')
        .attr("href")
        .endsWith("bundle.css")
        ).toBe(true);
    });
});

/*
test("", () => {
    //expect.assertions(1);
    return get("").then(data => {
        const $ = cheerio.load(data);
        expect($("p").text()).toBe("");
    });
});*/