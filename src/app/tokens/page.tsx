'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import toast from 'react-hot-toast';
import { toastStyles } from '../../utils/styles';

import { Navbar, CopyIcon, Decimal } from "../../components"
import { SATS_PER_BELL, ESPLORA_API, BELLSIGHT_API } from "@/utils/consts";

export default function Tokens() {
  const [data, setData] = useState<any>()
  const [message, setMessage] = useState<any>("")

  const GetAllTokens = async () => {
    await fetch(ESPLORA_API + "token/all")
      .then((res) => res.json())
      .then((result) => {
        setData(result)
      })
  }

  useEffect(() => {
    GetAllTokens()
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center lg:mt-0 mt-2 underline">TOKENS</h1>
          <div className="grid grid-cols-7 mt-6 mx-4">
            <div className="col-span-1 text-center border-2 rounded-tl-lg truncate">TICKER</div>
            <div className="col-span-3 text-center border-2 truncate">GENESIS</div>
            <div className="col-span-2 text-center border-2 truncate">SUPPLY</div>
            <div className="col-span-1 text-center border-2 rounded-tr-lg truncate">MINT COUNT</div>
          </div>
          <div className="h-[30rem] lg:h-[45rem] overflow-auto mx-4">
            {data?.map((element: any, index: any) => (
              <div key={index} className="grid grid-cols-7 border-b-2 border-l-2 border-r-2 hover:bg-base-100 p-2">
                <div className="col-span-1 text-center place-content-center">{element.tick}</div>
                <div className="col-span-3 text-center truncate place-content-center">{element.genesis}</div>
                <div className="col-span-2 text-center truncate place-content-center">{element.supply.toLocaleString(undefined, { minimumFractionDigits: 2 })} / {element.max.toLocaleString(undefined, { minimumFractionDigits: 0 })}</div>
                <div className="col-span-1 text-center truncate place-content-center">{element.mint_count}</div>
              </div>
            ))}
          </div>
        </div>
      }
      
    </div>
  )
}