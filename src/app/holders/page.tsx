"use client";
import React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Navbar, Footer, CopyIcon, Decimal, Loader } from "../../components";

export default function Holders() {
  const [data, setData] = useState<any>();
  const [dataCoingecko, setDataCoingecko] = useState<any>();

  const GetTopHolders = async () => {
    await fetch("https://api.nintondo.io/api/top-owners")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      });
  };

  const GetCoingeckoData = async () => {
    await fetch("https://api.coingecko.com/api/v3/coins/bellscoin")
      .then((res) => res.json())
      .then((result) => {
        setDataCoingecko(result);
      });
  };

  useEffect(() => {
    GetTopHolders();
    GetCoingeckoData();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {data && dataCoingecko ? (
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center lg:mt-0 mt-16 underline">
            TOP 100 HOLDERS
          </h1>
          <div className="grid grid-cols-4 mt-6 mx-4 bg-base-300 rounded-lg">
            <div className="col-span-1 text-center border-2 rounded-tl-lg">
              No
            </div>
            <div className="col-span-2 text-center border-2">ADDRESS</div>
            <div className="col-span-1 text-center border-2 rounded-tr-lg">
              $BEL
            </div>
          </div>
          {data[0] != null && (
            <div className="h-[30rem] lg:h-[45rem] overflow-auto mx-4">
              {data?.map((element: any, index: any) => (
                <Link key={index} passHref href={`/address/${element.address}`}>
                  <div className="grid grid-cols-4 border-b-2 border-l-2 border-r-2 hover:bg-base-100 bg-base-300 p-2">
                    <div className="col-span-1 text-center place-content-center">
                      {index + 1}
                    </div>
                    <div className="col-span-2 text-center truncate place-content-center">
                      {element.address}
                    </div>
                    <div className="col-span-1 text-center place-content-center">
                      {(element.balance / 100000000).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                      {` (${(
                        (element.balance / 100000000) *
                        dataCoingecko.market_data.current_price.usd
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                      })}$)`}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {data[0] == null && (
            <div className="col-span-1 text-center place-content-center">
              Error fetching data
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
      <Footer />
    </div>
  );
}
