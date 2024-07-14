'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import * as dateFns from "date-fns"

import { Navbar, Footer } from "../../components"

export default function Block() {
  const router = useRouter()
  const [data, setData] = useState<any>()

  const [value, setValue] = useState<any>("");

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
              <div key={index} className="grid grid-cols-6 border-b-2 border-l-2 border-r-2 hover:bg-gray-900 p-2">
                <div className="col-span-1 text-center place-content-center">{block.height}</div>
                <div className="col-span-3 text-center hover:text-blue-400 truncate place-content-center">
                  <Link passHref href={`/block/${block.id}`}>
                    {block.id}
                  </Link>
                </div>

                <div className="col-span-1 text-center ml-2 place-content-center">{dateFns.format(dateFns.fromUnixTime(block.timestamp), "yyyy/MM/dd - hh:mm:ss")}</div>
                <div className="col-span-1 text-center place-content-center">{block.tx_count}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-3"><button className="btn w-32 rounded-lg" onClick={() => GetNextBlocks()}>SHOW MORE</button></div>
        </div>
      }
      <Footer />
    </div>
  )
}