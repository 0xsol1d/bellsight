'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

import { Navbar, Footer } from "../../../components"

export default function Block({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [data, setData] = useState<any>()

  const GetAddress = async (addr: any) => {
    await fetch('https://api.nintondo.io/api/address/' + addr)
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setData(result)
      })
  }

  useEffect(() => {
    GetAddress(params.id)
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center mt-2">ADDRESS</h1>
          <br />
          <div className='flex justify-center'>
            <div>{params.id}</div>
            </div>
        </div>
      }
      <Footer/>
    </div>
  )
}