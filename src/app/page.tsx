'use client'
import { useEffect, useState } from "react";
import React from 'react';
import Link from "next/link";

import { Navbar, Footer } from "../components"

export default function Home() {
  const [dataCG, setDataCG] = useState<any>()
  const [dataN, setDataN] = useState<any>()
  const [height, setHeight] = useState<any>()
  const [txs, setTxs] = useState<any>()
  const [blocks, setBlocks] = useState<any>()

  const [message, setMessage] = useState<any>("")

  useEffect(() => {
    GetPrice()
    GetOverview()
    GetHeight()
  }, []);

  const GetRecentTxs = async () => {
    await fetch('https://api.nintondo.io/api/mempool/recent')
      .then((res) => res.json())
      .then(async (result) => {
        setTxs(result)
      })
  }

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

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);
    showAlert("Copied block id!")
  }

  function showAlert(msg: string) {
    setMessage(msg)
    const alert = document.getElementById('alert');
    alert?.classList.remove('opacity-0');
    alert?.classList.add('opacity-100');

    // Alert nach 3 Sekunden wieder ausblenden
    setTimeout(() => {
      closeAlert();
    }, 3000);
  }

  function closeAlert() {
    const alert = document.getElementById('alert');
    alert?.classList.remove('opacity-100');
    alert?.classList.add('opacity-0');
  }

  useEffect(() => {
    GetRecentTxs()
    GetBlocks()
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {dataCG && height &&
        <div className="grid grid-flow-row auto-rows-max"> 
          <h1 className="text-center lg:mt-0 mt-16">OVERVIEW</h1>
          <div className="grid lg:grid-cols-2">
            <div>
              <h1 className="text-center place-content-center p-4 underline">PRICE</h1>
              <div className="grid lg:grid-cols-4 grid-cols-2">
                <div className="text-center p-4"><div>MARKETCAP</div><br /><div>{(((dataN.circulating_supply) / 100000000) * dataCG.market_data.current_price.usd).toLocaleString(undefined, { minimumFractionDigits: 0 })}$</div></div>
                <div className="text-center border-l-2 p-4"><div>PRICE</div><div>{dataCG.market_data.current_price.usd}$</div><div>{(dataCG.market_data.price_change_24h).toFixed(6)}$</div></div>
                <div className="text-center lg:border-l-2 p-4"><div>ATH</div><div>{dataCG.market_data.ath.usd}$</div><div>{(dataCG.market_data.ath_change_percentage.usd).toFixed(2)}%</div></div>
                <div className="text-center border-l-2 p-4"><div>ATL</div><div>{dataCG.market_data.atl.usd}$</div><div>{(dataCG.market_data.atl_change_percentage.usd).toFixed(2)}%</div></div>
              </div>
            </div>
            <div>
              <h1 className="text-center place-content-center p-4 underline">BLOCKCHAIN</h1>
              <div className="grid lg:grid-cols-3 grid-cols-2">
                <div className="text-center rounded-l-xl p-4"><div>SUPPLY</div><br /><div>{((dataN.circulating_supply) / 100000000).toLocaleString(undefined, { minimumFractionDigits: 0 })}</div></div>
                <div className="text-center border-l-2 p-4"><div>BLOCK HEIGHT</div><br /><div>{height}</div></div>
                <div className="text-center lg:border-l-2 rounded-r-xl lg:p-4"><div>DIFFICULTY</div><br /><div>{(dataN.difficulty).toFixed(0)}</div></div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 p-4 mb-12 break-all">
            <div className="bg-base-200 rounded-lg">
              <h1 className="text-center place-content-center">RECENT TXs</h1>
              {txs?.map((tx: any, index: any) => (
                <Link key={index} passHref href={`/tx/${tx.txid}`}>
                  <div key={index} className="lg:grid grid-cols-2 hover:bg-gray-900 p-2 w-full text-xs border-base-300 border-t-2">
                    <div className="text-blue-500">{tx.txid}</div>
                    <div className="text-right">{(tx.value / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-base-200 rounded-lg">
              <h1 className="text-center place-content-center">LATETST BLOCKS</h1>
              {blocks?.map((block: any, index: any) => (
                <Link key={index} passHref href={`/block/${block.id}`}>
                  <div key={index} className="lg:grid grid-cols-2 hover:bg-gray-900 p-2 w-full text-xs border-base-300 border-t-2">
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
      <div className="flex justify-center fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div id="alert" className="w-60 alert alert-info transition-opacity duration-1000 opacity-0">
          <span>{message}</span>
          <button onClick={() => closeAlert()} className="ml-auto btn btn-sm btn-circle btn-ghost">✕</button>
        </div>
      </div>
    </div>
  );
}