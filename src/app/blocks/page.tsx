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

  const handleScroll = (e: any) => {
    var isAtBottom = e.target.scrollHeight - e.target.scrollTop <= (e.target.clientHeight + 1)
    //console.log(isAtBottom + "_" + e.target.clientHeight + "-" + (e.target.scrollHeight - e.target.scrollTop))
    if (isAtBottom) {
      // Load next blocks   
      GetNextBlocks()
    }
  }

  useEffect(() => {
    GetBlocks()
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center lg:mt-0 mt-16">LATEST BLOCKS</h1>
          <div className="grid grid-cols-6 mt-6 mx-4 bg-base-300 rounded-lg">
            <div className="col-span-1 text-center border-2 rounded-tl-lg truncate">HEIGHT</div>
            <div className="col-span-3 text-center border-2 truncate">ID</div>
            <div className="col-span-1 text-center border-2 truncate">TIMESTAMP</div>
            <div className="col-span-1 text-center border-2 rounded-tr-lg truncate">TX COUNT</div>
          </div>
          <div className="h-[30rem] lg:h-[45rem] overflow-auto mx-4" onScroll={handleScroll}>
            {data?.map((block: any, index: any) => (
              <Link key={index} passHref href={`/block/${block.id}`}>
                <div className="grid grid-cols-6 border-b-2 border-l-2 border-r-2 hover:bg-base-100 bg-base-300 p-2">
                  <div className="col-span-1 text-center place-content-center">{block.height}</div>
                  <div className="col-span-3 text-center truncate place-content-center">{block.id}</div>
                  <div className="col-span-1 text-center ml-2 place-content-center">{dateFns.format(dateFns.fromUnixTime(block.timestamp), "yyyy/MM/dd - HH:mm:ss")}</div>
                  <div className="col-span-1 text-center place-content-center">{block.tx_count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      }
      <Footer />
    </div>
  )
}