import Head from "next/head";
import fetch from "node-fetch";
import { useEffect, useState } from "react";

export default function Home() {
  const [local, setLocal] = useState([]);

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
    };
    fetchIp();
  }, []);

  return (
    <div className="home">
      <Head>
        <title>Big Mac</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p>
        You are located in {""}
        {local.result?.data?.country_name
          ? local.result?.data?.country_name
          : "..."}
      </p>
      <p>Please enter an amount of money in your local currency</p>
      <input type="text"></input>

      <p>You could buy [#] of Big Macs in your country</p>
      <p>Your Dollar Purchasing Parity (PPP) is [#]</p>
      <p>
        Random Country: [RANDOM COUNTRY] You could buy [#] of Big Macs in [RAND
        COUNTRY] with [INPUT]! (calculation is (INPUT / local price) * (local
        dollar price / RAND COUNTRY dollar price) Your [INPUT] is worth about
        [#] in [RAND COUNTRY] (Calculation is [INPUT] * (local dollar price /
        RAND COUNTRY dollar price))
      </p>
    </div>
  );
}
