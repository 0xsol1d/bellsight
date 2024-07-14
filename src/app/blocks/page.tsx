'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as dateFns from "date-fns"

import { Navbar, Footer } from "../../components"

export default function Block() {
  const [data, setData] = useState<any>()
  const [message, setMessage] = useState<any>("")

  const GetBlocks = async () => {
    await fetch('https://api.nintondo.io/api/blocks')
      .then((res) => res.json())
      .then(async (result) => {
        setData(result)
        await fetch('https://api.nintondo.io/api/blocks/' + (result[result.length - 1].height - 1))
          .then((res) => res.json())
          .then(async (result) => {
            await fetch('https://api.nintondo.io/api/blocks/' + (result[result.length - 1].height - 1))
              .then((res) => res.json())
              .then((result) => {
                result.forEach((element: any) => {
                  setData((state: any) => [...state, element])
                });
              })
          })
      })
  }

  const GetNextBlocks = async () => {
    await fetch('https://api.nintondo.io/api/blocks/' + (data[data.length - 1].height - 1))
      .then((res) => res.json())
      .then((result) => {
        result.forEach((element: any) => {
          setData((state: any) => [...state, element])
        });
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
    GetBlocks()
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center mt-2">LATEST BLOCKS</h1>
          <br />
          <div className="grid grid-cols-6 mt-6 mx-4">
            <div className="col-span-1 text-center border-2 rounded-tl-lg">HEIGHT</div>
            <div className="col-span-3 text-center border-2">ID</div>
            <div className="col-span-1 text-center border-2">TIMESTAMP</div>
            <div className="col-span-1 text-center border-2 rounded-tr-xl">TX COUNT</div>
          </div>
          <div className="h-[34rem] overflow-auto mx-4">
            {data?.map((block: any, index: any) => (
              <Link passHref href={`/block/${block.id}`}>
                <div key={index} className="grid grid-cols-6 border-b-2 border-l-2 border-r-2 hover:bg-gray-900 p-2">
                  <div className="col-span-1 text-center place-content-center">{block.height}</div>
                  <div className="col-span-3 text-center truncate place-content-center">{block.id}</div>
                  <div className="col-span-1 text-center ml-2 place-content-center">{dateFns.format(dateFns.fromUnixTime(block.timestamp), "yyyy/MM/dd - HH:mm:ss")}</div>
                  <div className="col-span-1 text-center place-content-center">{block.tx_count}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-3"><button className="btn w-32 rounded-lg" onClick={() => GetNextBlocks()}>SHOW MORE</button></div>
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