import fetch from "node-fetch";

export default async (req, res) => {
  const { query } = req;
  console.log("query", query);

  const data = await fetch(
    `https://ipvigilante.com/json/${query.ip}/country_name`
  );
  const result = await data.json();

  console.log("ipvigiliante result", result.data.country_name);

  res.statusCode = 200;
  res.json({ result });
};
