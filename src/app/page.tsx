'use client'
import { useEffect, useState } from "react";
import React from 'react';
import Link from "next/link";

import { Navbar, Footer, CopyIcon, Decimal } from "../components"

export default function Home() {
  const [dataCG, setDataCG] = useState<any>()
  const [dataN, setDataN] = useState<any>()
  const [height, setHeight] = useState<any>()
  const [txs, setTxs] = useState<any>()
  const [blocks, setBlocks] = useState<any>()

  const [averageBlockTime, setAverageBlockTime] = useState<any>("")
  let blocksForAverageTime: any = [];

  useEffect(() => {
    GetPrice()
    GetOverview()
    GetHeight()
  }, []);

  const compareTimestamps = (timestamp1: number, timestamp2: number): number => {
    const differenceInSeconds = Math.abs(timestamp2 - timestamp1)
    const differenceInMinutes = Math.floor(differenceInSeconds / 60)
    return differenceInMinutes
  };

  const GetAverageBlockTime = (dat: any) => {
    let totalDifference = 0
    let count = 1

    dat.forEach((block: any, index: number) => {
      if (index > 0) {
        totalDifference += compareTimestamps(dat[index - 1].timestamp, block.timestamp)
        count++
      }
    })
    setAverageBlockTime((totalDifference / count).toFixed(1))
  }

  const GetRecentTxs = async () => {
    await fetch('https://api.nintondo.io/api/mempool/recent')
      .then((res) => res.json())
      .then((result) => {
        setTxs(result)
      })
  }

  const fetchBlocks = async (height?: number) => {
    const url = height ? `https://api.nintondo.io/api/blocks/${height}` : 'https://api.nintondo.io/api/blocks';
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
  
    GetAverageBlockTime(blocksForAverageTime);
  };

  const GetBlocks = async () => {
    await fetch('https://api.nintondo.io/api/blocks')
      .then((res) => res.json())
      .then(async (result) => {
        setBlocks(result)
      })
  }

  const GetHeight = async () => {
    await fetch('https://api.nintondo.io/api/blocks/tip/height')
      .then((res) => res.json())
      .then(async (result) => {
        setHeight(result)
      })
  }

  const GetPrice = async () => {
    await fetch('https://api.coingecko.com/api/v3/coins/bellscoin')
      .then((res) => res.json())
      .then((result) => {
        setDataCG(result)
      })
  }

  const GetOverview = async () => {
    await fetch('https://api.nintondo.io/api/stats/bells')
      .then((res) => res.json())
      .then((result) => {
        setDataN(result)
      })
  }

  useEffect(() => {
    GetRecentTxs()
    GetBlocks()
    GetBlocksForAverageTime()
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {dataCG && dataN && height &&
        <div className="grid grid-flow-row auto-rows-max">
          <div className="flex justify-center mt-20 lg:mt-2">
            <div className="lg:flex justify-between place-content-center text-xs lg:text-sm bg-base-200 rounded-lg">
              <div className="flex justify-between">
                <div className="text-center p-4"><div>MARKETCAP</div><div>{(Math.round((dataN.circulating_supply / 100000000) * dataCG.market_data.current_price.usd)).toLocaleString(undefined, { minimumFractionDigits: 0 })}$</div></div>
                <div className="text-center p-4"><div>PRICE</div><div>{dataCG.market_data.current_price.usd}$</div></div>
              </div>
              <div className="flex justify-between">
                {dataN.difficulty != null &&
                  <>
                    <div className="text-center rounded-l-xl p-4"><div>SUPPLY</div><div>{(dataN.circulating_supply / 100000000).toLocaleString(undefined, { minimumFractionDigits: 0 })}</div></div>
                    <div className="text-center  p-4"><div>BLOCK HEIGHT</div><div>{height}</div></div>
                    <div className="text-center p-4"><div>DIFFICULTY</div><div>{(dataN.difficulty).toFixed(0)}</div></div>
                    <div className="text-center p-4"><div>AVERAGE BLOCKTIME</div><div>{averageBlockTime}&nbsp;min</div></div>
                  </>
                }

                {dataN.difficulty == null &&
                  <div className="text-center rounded-l-xl p-4">Error fetching data</div>

                }
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 p-4 mb-12 break-all">
            <div className="bg-base-200 rounded-lg">
              <h1 className="text-center place-content-center">RECENT TXs</h1>
              {txs?.map((tx: any, index: any) => (
                <Link key={index} passHref href={`/tx/${tx.txid}`}>
                  <div key={index} className="lg:flex justify-between hover:bg-gray-900 p-2 w-full text-xs border-base-300 border-t-2">
                    <div className="text-blue-500">{tx.txid}</div>
                    <div className="text-right flex justify-end"><Decimal number={tx.value / 100000000} dec={8} />&nbsp;$BEL</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-base-200 rounded-lg">
              <h1 className="text-center place-content-center">LATETST BLOCKS</h1>
              {blocks?.map((block: any, index: any) => (
                <Link key={index} passHref href={`/block/${block.id}`}>
                  <div key={index} className="lg:flex justify-between hover:bg-gray-900 p-2 w-full text-xs border-base-300 border-t-2">
                    <div className="text-blue-500">{block.id}</div>
                    <div className="text-right">{block.height}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      }
      <Footer />
    </div>
  );
}