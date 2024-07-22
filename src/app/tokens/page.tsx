'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

import { Navbar, Footer, CopyIcon, Decimal } from "../../components"

export default function Tokens() {
  const [data, setData] = useState<any>()
  const [message, setMessage] = useState<any>("")

  const GetAllTokens = async () => {
    await fetch('https://api.nintondo.io/api/token/all')
      .then((res) => res.json())
      .then((result) => {
        setData(result)
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
    GetAllTokens()
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center lg:mt-0 mt-16 underline">TOKENS</h1>
          <div className="grid grid-cols-7 mt-6 mx-4">
            <div className="col-span-1 text-center border-2 rounded-tl-lg truncate">TICKER</div>
            <div className="col-span-3 text-center border-2 truncate">GENESIS</div>
            <div className="col-span-2 text-center border-2 truncate">SUPPLY</div>
            <div className="col-span-1 text-center border-2 rounded-tr-lg truncate">MINT COUNT</div>
          </div>
          <div className="h-[30rem] lg:h-[45rem] overflow-auto mx-4">
            {data?.map((element: any, index: any) => (
              <div key={index} className="grid grid-cols-7 border-b-2 border-l-2 border-r-2 hover:bg-gray-900 p-2">
                <div className="col-span-1 text-center place-content-center">{element.tick}</div>
                <div className="col-span-3 text-center truncate place-content-center">{element.genesis}</div>
                <div className="col-span-2 text-center truncate place-content-center">{element.supply.toLocaleString(undefined, { minimumFractionDigits: 2 })} / {element.max.toLocaleString(undefined, { minimumFractionDigits: 0 })}</div>
                <div className="col-span-1 text-center truncate place-content-center">{element.mint_count}</div>
              </div>
            ))}
          </div>
        </div>
      }
      <Footer/>
      <div className="flex justify-center fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div id="alert" className="w-60 alert alert-info transition-opacity duration-1000 opacity-0">
          <span>{message}</span>
          <button onClick={() => closeAlert()} className="ml-auto btn btn-sm btn-circle btn-ghost">✕</button>
        </div>
      </div>
    </div>
  )
}