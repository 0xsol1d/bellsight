'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

import { Navbar, Footer } from "../../components"

export default function Block() {
  const router = useRouter()
  const [data, setData] = useState<any>()

  const [value, setValue] = useState<any>("");

  const GetAllTokens = async () => {
    await fetch('https://api.nintondo.io/api/token/all')
      .then((res) => res.json())
      .then((result) => {
        setData(result)
      })
  }

  const Search = async (input: any) => {
    console.log("YOUR INPUT: " + input)
    if (isNaN(input)) {
      if (value.length == 64) {
        router.push("/tx/" + value);
      }
      else if (value.length <= 35) {
        router.push("/address/" + value);
      }
    }
    else {
      router.push("/block/" + value);
    }
  }

  useEffect(() => {
    GetAllTokens()
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center mt-2">TOKENS</h1>
          <br /><div className="grid grid-cols-7 mt-6 mx-4">
            <div className="col-span-1 text-center border-2 rounded-tl-lg">TICKER</div>
            <div className="col-span-3 text-center border-2">GENESIS</div>
            <div className="col-span-2 text-center border-2">SUPPLY</div>
            <div className="col-span-1 text-center border-2 rounded-tr-lg">MINT COUNT</div>
          </div>
          <div className="h-[45rem] overflow-auto mx-4">
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
    </div>
  )
}