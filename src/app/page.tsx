'use client'
import { useEffect, useState } from "react";
import React from 'react';
import Link from "next/link";

import { Navbar, Footer } from "../components"

export default function Home() {
  const [dataCG, setDataCG] = useState<any>()
  const [dataN, setDataN] = useState<any>()
  const [blocks, setBlocks] = useState<any>()

  const [message, setMessage] = useState<any>("")

  useEffect(() => {
    GetPrice()
    GetOverview()
    GetBlocks()
  }, []);

  const GetBlocks = async () => {
    await fetch('https://api.nintondo.io/api/blocks')
      .then((res) => res.json())
      .then(async (result) => {
        setBlocks(result)
        await fetch('https://api.nintondo.io/api/blocks/' + (result[result.length - 1].height - 1))
          .then((res) => res.json())
          .then(async (result) => {
            await fetch('https://api.nintondo.io/api/blocks/' + (result[result.length - 1].height - 1))
              .then((res) => res.json())
              .then((result) => {
                result.forEach((element: any) => {
                  setBlocks((state: any) => [...state, element])
                });
              })
          })
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

  return (
    <div className="min-h-screen">
      <Navbar />

      {dataCG &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center text-3xl mt-2">OVERVIEW</h1>
          <br />
          <div className="grid lg:grid-cols-2">
            <div>
              <h1 className="text-center place-content-center p-4 underline">PRICE</h1>
              <div className="flex justify-center">
                <div className="text-center p-4"><div>MARKETCAP</div><br /><div>{(((dataN.circulating_supply) / 100000000) * dataCG.market_data.current_price.usd).toLocaleString(undefined, { minimumFractionDigits: 0 })}$</div></div>
                <div className="text-center border-l-2 p-4"><div>PRICE</div><div>{dataCG.market_data.current_price.usd}$</div><div>{(dataCG.market_data.price_change_24h).toFixed(6)}$</div></div>
                <div className="text-center border-l-2 p-4"><div>ATH</div><div>{dataCG.market_data.ath.usd}$</div><div>{(dataCG.market_data.ath_change_percentage.usd).toFixed(2)}%</div></div>
                <div className="text-center border-l-2 p-4"><div>ATL</div><div>{dataCG.market_data.atl.usd}$</div><div>{(dataCG.market_data.atl_change_percentage.usd).toFixed(2)}%</div></div>
              </div>
            </div>
            <div>
              <h1 className="text-center place-content-center p-4 underline">BLOCKCHAIN</h1>
              <div className="flex justify-center">
                <div className="text-center rounded-l-xl p-4"><div>SUPPLY</div><br /><div>{((dataN.circulating_supply) / 100000000).toLocaleString(undefined, { minimumFractionDigits: 0 })}</div></div>
                <div className="text-center border-l-2 p-4"><div>BLOCK HEIGHT</div><br /><div>{blocks[0].height}</div></div>
                <div className="text-center border-l-2 rounded-r-xl p-4"><div>DIFFICULTY</div><br /><div>{(dataN.difficulty).toFixed(0)}</div></div>
              </div>
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