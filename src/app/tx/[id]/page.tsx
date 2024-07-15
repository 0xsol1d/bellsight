'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Navbar, Footer } from "../../../components"

export default function Tx({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>()
  const [message, setMessage] = useState<any>("")

  const GetTransaction = async (id: any) => {
    await fetch('https://api.nintondo.io/api/tx/' + id)
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
    GetTransaction(params.id)
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max">
          <h1 className="text-center lg:mt-0 mt-16">TX {params.id}</h1>
          <br />
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