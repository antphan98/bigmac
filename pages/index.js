import Head from "next/head";
import fetch from "node-fetch";
import { useEffect, useState } from "react";

export default function Home() {
  const [local, setLocal] = useState([]);
  const [bigMac, setBigMac] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchIp = async () => {
      const data = await fetch("https://api.ipify.org/?format=json");
      const result = await data.json();
      console.log("homeresult", result);

      const countryResponse = await fetch(
        `/api/ip-to-country/?ip=${result.ip}`
      );
      const countryResult = await countryResponse.json();
      setLocal(countryResult);
      console.log("country", countryResult);

      const bigMac = await fetch(
        `/api/bigmac?country=${countryResult.result.data.country_name}`
      );
      const bigMacResult = await bigMac.json();
      setBigMac(bigMacResult);
    };
    fetchIp();
  }, []);

  const formattedInput =
    (
      input &&
      (parseFloat(input) % 1 === 0 ? input : parseFloat(input).toFixed(2))
    ).toLocaleString() || "...";

  return (
    <div className="home">
      <Head>
        <title>Big Mac</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Big Mac's Around the World</h1>
      <h1>You are located in {local.result?.data?.country_name || "..."}</h1>
      <p>Please enter an amount of money in your local currency</p>
      <input
        onChange={(event) => setInput(event.target.value)}
        type="text"
      ></input>

      <p>
        You could buy{" "}
        {parseInt(
          parseFloat(input) / parseFloat(bigMac?.myCountry?.["Local price"])
        ).toLocaleString() || "0"}{" "}
        Big Macs in your country
      </p>
      <p>
        Your Dollar Purchasing Parity (PPP) is{" "}
        {bigMac?.myCountry?.["Dollar PPP"]}
      </p>
      <h1>Random Country: {bigMac?.randomCountry?.Country}</h1>

      <p>
        {" "}
        You could buy{" "}
        {parseInt(
          (parseFloat(input) / parseFloat(bigMac?.myCountry?.["Local price"])) *
            parseFloat(
              bigMac?.myCountry?.["Dollar price"] /
                parseFloat(bigMac?.randomCountry?.["Dollar price"])
            )
        ).toLocaleString() || "0"}{" "}
        of Big Macs in {bigMac?.randomCountry?.Country} with {formattedInput}!
        Your {formattedInput} is worth about{" "}
        {parseInt(
          parseFloat(input) *
            parseFloat(
              bigMac?.myCountry?.["Dollar price"] /
                parseFloat(bigMac?.randomCountry?.["Dollar price"])
            )
        ).toLocaleString()}{" "}
        in {bigMac?.randomCountry?.Country}
      </p>
    </div>
  );
}
