'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

import { Navbar, Footer } from "../../components"

export default function Block() {
  const router = useRouter()
  const [data, setData] = useState<any>()

  const GetTopHolders = async () => {
    await fetch('https://api.nintondo.io/api/top-owners')
      .then((res) => res.json())
      .then((result) => {
        setData(result)
      })
  }

  useEffect(() => {
    GetTopHolders()
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center mt-2">TOP 100 HOLDERS</h1>
          <br />
          <div className="grid grid-cols-4 mt-6 mx-4">
            <div className="col-span-1 text-center border-2 rounded-tl-lg">No</div>
            <div className="col-span-2 text-center border-2">ADDRESS</div>
            <div className="col-span-1 text-center border-2 rounded-tr-lg">$BEL</div>
          </div>
          <div className="h-[45rem] overflow-auto mx-4">
            {data?.map((element: any, index: any) => (
              <div key={index} className="grid grid-cols-4 border-b-2 border-l-2 border-r-2 hover:bg-gray-900 p-2">
                <div className="col-span-1 text-center place-content-center">{index + 1}</div>
                <div className="col-span-2 text-center hover:text-blue-400 truncate place-content-center">
                  <Link passHref href={`/address/${element.address}`}>
                    {element.address}
                  </Link>
                </div>
                <div className="col-span-1 text-center place-content-center">{((element.balance) / 100000000).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </div>
            ))}
          </div>
        </div>
      }
      <Footer/>
    </div>
  )
}