'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

import { Navbar, Footer } from "../../../components"

export default function Block({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [data, setData] = useState<any>()

  const GetBlock = async (id: any) => {
    await fetch('https://api.nintondo.io/api/block/' + id)
      .then((res) => res.json())
      .then((result) => {
        setData(result)
      })
  }

  useEffect(() => {
    GetBlock(params.id)
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center mt-2">BLOCK {params.id}</h1>
          <br />
        </div>
      }
      <Footer/>
    </div>
  )
}