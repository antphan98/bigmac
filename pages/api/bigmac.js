import _ from "lodash";
const csv = require("csv-parser");
const fs = require("fs");

// Get country query params
// Filter to country .filter(country => country === {})
// Lodash orderby ._orderBy(results, ["Date"], ["asc"])

export default async (req, res) => {
  const { country } = req.query;
  const results = [];

  fs.createReadStream("big-mac-index.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      console.log(results);
      const matchingCountryData = results.filter(
        (row) => row.Country === country
      );
      const orderedByDate = _.orderBy(matchingCountryData, ["Date"], ["desc"]);
      const randomCountryData = results.filter(
        (row) => row.Country !== country
      );
      const randomCountryOrder = _.orderBy(
        randomCountryData,
        ["Date"],
        ["desc"]
      );
      const randomCountryUnique = _.uniqBy(randomCountryOrder, "Country");
      const randomCountrySample = _.sample(randomCountryUnique);

      res.status(200).json({
        myCountry: orderedByDate[0],
        randomCountry: randomCountrySample,
      });
    });
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
