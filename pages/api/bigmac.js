import _ from "lodash";
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const csv = require("csv-parser");
const fs = require("fs");

// Get country query params
// Filter to country .filter(country => country === {})
// Lodash orderby ._orderBy(results, ["Date"], ["asc"])

const formatData = (results, country) => {
  const matchingCountryData = results.filter((row) => row.Country === country);
  const orderedByDate = _.orderBy(matchingCountryData, ["Date"], ["desc"]);
  const randomCountryData = results.filter((row) => row.Country !== country);
  const randomCountryOrder = _.orderBy(randomCountryData, ["Date"], ["desc"]);
  const randomCountryUnique = _.uniqBy(randomCountryOrder, "Country");
  const randomCountrySample = _.sample(randomCountryUnique);

  return {
    myCountry: orderedByDate[0],
    randomCountry: randomCountrySample,
  };
};

export default async (req, res) => {
  const { country } = req.query;

  let bigMacData = myCache.get("bigMacData");

  if (bigMacData) {
    console.log("cache exists");
    const response = formatData(bigMacData, country);
    res.status(200).json(response);
  } else {
    console.log("cache not found");
    bigMacData = [];
    fs.createReadStream("big-mac-index.csv")
      .pipe(csv())
      .on("data", (data) => bigMacData.push(data))
      .on("end", () => {
        myCache.set("bigMacData", bigMacData);
        const response = formatData(bigMacData, country);
        res.status(200).json(response);
      });
  }

  //   res.status(200).json({ country });
  // response
  /*
    {
        myCountry: { Country: 'United States", ... },
        randomCountry: { Country: 'Spain", ... }
    }

    myCountry = results filter my country, orderBy date, choose most recent
    randomCountry = results filter ! my country, _.sample from filtered 
  */
};
