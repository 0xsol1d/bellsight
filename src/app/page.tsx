"use client";
import { useEffect, useRef, useState } from "react";
import React from "react";
import Link from "next/link";

import { Navbar, Footer, CopyIcon, Decimal, TradingViewWidget, Loader } from "../components";

export default function Home() {
  const [dataNonkyc, setDataNonkyc] = useState<any>();
  const [dataCoingecko, setDataCoingecko] = useState<any>();
  const [dataNintondo, setDataNintondo] = useState<any>();
  const [height, setHeight] = useState<any>();
  const [txs, setTxs] = useState<any>();
  const [blocks, setBlocks] = useState<any>();

  const [averageBlockTime, setAverageBlockTime] = useState<any>("");
  const fetchBlocks = async (height?: number) => {
    const url = height
      ? `https://api.nintondo.io/api/blocks/${height}`
      : "https://api.nintondo.io/api/blocks";
    const response = await fetch(url);
    const result = await response.json();
    return result;
  };

  const GetBlocksForAverageTime = async () => {
    let blocksForAverageTime: any[] = [];
    let result = await fetchBlocks();

    blocksForAverageTime.push(...result);

    for (let i = 0; i < 9; i++) {
      const lastHeight = result[result.length - 1].height - 1;
      result = await fetchBlocks(lastHeight);
      blocksForAverageTime.push(...result);
    }
    console.log(blocksForAverageTime)
    GetAverageBlockTime(blocksForAverageTime);
  };

  const compareTimestamps = (
    timestamp1: number,
    timestamp2: number
  ): number => {
    const differenceInSeconds = Math.abs(timestamp2 - timestamp1);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    return differenceInMinutes;
  };

  const GetAverageBlockTime = (dat: any) => {
    let totalDifference = 0;
    let count = 1;

    dat.forEach((block: any, index: number) => {
      if (index > 0) {
        totalDifference += compareTimestamps(
          dat[index - 1].timestamp,
          block.timestamp
        );
        count++;
      }
    });
    setAverageBlockTime((totalDifference / count).toFixed(2));
  };

  const GetRecentTxs = async () => {
    await fetch("https://api.nintondo.io/api/mempool/recent")
      .then((res) => res.json())
      .then((result) => {
        setTxs(result);
      });
  };

  const GetBlocks = async () => {
    await fetch("https://api.nintondo.io/api/blocks")
      .then((res) => res.json())
      .then(async (result) => {
        setBlocks(result);
      });
  };

  const GetHeight = async () => {
    await fetch("https://api.nintondo.io/api/blocks/tip/height")
      .then((res) => res.json())
      .then(async (result) => {
        setHeight(result);
      });
  };

  const GetNintondoData = async () => {
    await fetch("https://api.nintondo.io/api/stats/bells")
      .then((res) => res.json())
      .then((result) => {
        setDataNintondo(result);
      });
  };
  const GetCoingeckoData = async () => {
    await fetch("https://api.coingecko.com/api/v3/coins/bellscoin")
      .then((res) => res.json())
      .then((result) => {
        setDataCoingecko(result);
      });
  };

  const GetNonkycData = async () => {
    await fetch(
      "https://api.nonkyc.io/api/v2/ticker/BEL_USDT"
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setDataNonkyc(result);
      });
  };

  useEffect(() => {
    GetCoingeckoData();
    GetNonkycData();
    GetNintondoData();
    GetHeight();
    GetRecentTxs();
    GetBlocks();
    GetBlocksForAverageTime();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {dataCoingecko && dataNintondo && dataNonkyc && height ? (
        <div className="grid grid-flow-row auto-rows-max">
          <div className="flex justify-center mt-20 lg:mt-2">
            <div className="lg:flex justify-between place-content-center text-xs lg:text-sm bg-base-200 rounded-lg">
              <div className="lg:flex grid grid-cols-2 justify-between">
                <div className="text-center p-4">
                  <div>MARKETCAP</div>
                  <div>
                    {Math.round(
                      (dataNintondo.circulating_supply / 100000000) *
                      dataCoingecko.market_data.current_price.usd
                    ).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                    $
                  </div>
                </div>
                <div className="text-center p-4">
                  <div>PRICE</div>
                  <div>{dataCoingecko.market_data.current_price.usd.toFixed(4)}$</div>
                </div>
                {dataNintondo.difficulty != null && (
                  <>
                    <div className="text-center rounded-l-xl p-4">
                      <div>SUPPLY</div>
                      <div>
                        {(
                          dataNintondo.circulating_supply / 100000000
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                    <div className="text-center  p-4">
                      <div>BLOCK HEIGHT</div>
                      <div>{height}</div>
                    </div>
                    <div className="text-center p-4">
                      <div>DIFFICULTY</div>
                      <div>{dataNintondo.difficulty.toFixed(0)}</div>
                    </div>
                  </>
                )}
                <div className="text-center p-4">
                  <div>AVERAGE BLOCKTIME</div>
                  <div>{averageBlockTime}&nbsp;min</div>
                </div>

                {dataNintondo.difficulty == null && (
                  <div className="text-center rounded-l-xl p-4">
                    Error fetching data
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 p-4 mb-12 break-all">
            <div className="bg-base-200 rounded-lg">
              <h1 className="text-center place-content-center">RECENT TXs</h1>
              {txs?.map((tx: any, index: any) => (
                <Link key={index} passHref href={`/tx/${tx.txid}`}>
                  <div
                    key={index}
                    className="lg:flex justify-between hover:bg-gray-900 p-2 w-full text-xs border-base-300 border-t-2"
                  >
                    <div className="text-blue-500">{tx.txid}</div>
                    <div className="text-right flex justify-end">
                      <Decimal number={tx.value / 100000000} dec={8} />
                      &nbsp;$BEL
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-base-200 rounded-lg">
              <h1 className="text-center place-content-center">
                LATEST BLOCKS
              </h1>
              {blocks?.map((block: any, index: any) => (
                <Link key={index} passHref href={`/block/${block.id}`}>
                  <div
                    key={index}
                    className="lg:flex justify-between hover:bg-gray-900 p-2 w-full text-xs border-base-300 border-t-2"
                  >
                    <div className="text-blue-500">{block.id}</div>
                    <div className="text-right">{block.height}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ):(<Loader/>)}      
      <Footer />
    </div>
  );
}
