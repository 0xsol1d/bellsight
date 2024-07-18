'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Navbar, Footer, CopyIcon, Decimal } from "../../components"

export default function Block() {
  const [data, setData] = useState<any>()
  const [message, setMessage] = useState<any>("")

  const GetTopHolders = async () => {
    await fetch('https://api.nintondo.io/api/top-owners')
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
    GetTopHolders()
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center lg:mt-0 mt-16 underline">TOP 100 HOLDERS</h1>
          <div className="grid grid-cols-4 mt-6 mx-4 bg-base-300 rounded-lg">
            <div className="col-span-1 text-center border-2 rounded-tl-lg">No</div>
            <div className="col-span-2 text-center border-2">ADDRESS</div>
            <div className="col-span-1 text-center border-2 rounded-tr-lg">$BEL</div>
          </div>
          {data[0] != null &&
            <div className="h-[30rem] lg:h-[45rem] overflow-auto mx-4">
              {data?.map((element: any, index: any) => (
                <Link key={index} passHref href={`/address/${element.address}`}>
                  <div className="grid grid-cols-4 border-b-2 border-l-2 border-r-2 hover:bg-base-100 bg-base-300 p-2">
                    <div className="col-span-1 text-center place-content-center">{index + 1}</div>
                    <div className="col-span-2 text-center truncate place-content-center">
                      {element.address}
                    </div>
                    <div className="col-span-1 text-center place-content-center">{((element.balance) / 100000000).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  </div>
                </Link>
              ))}
            </div>
          }

          {data[0] == null &&
            <div className="col-span-1 text-center place-content-center">Error fetching data</div>
          }
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
  )
}