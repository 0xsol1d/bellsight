'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

import { Navbar, Footer } from "../../../components"

export default function Block({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>()
  const [message, setMessage] = useState<any>("")

  const GetAddress = async (addr: any) => {
    await fetch('https://api.nintondo.io/api/address/' + addr)
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setData(result)
      })
  }

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);
    showAlert("Copied address!")
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
    GetAddress(params.id)
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      {data &&
        <div className="grid grid-flow-row auto-rows-max place-content-center">
          <h1 className="text-center mt-2">ADDRESS</h1>
          <br />
          <div>
            <div className='flex justify-center mb-4'> <button className='hover:text-blue-500' onClick={() => copyAddress(params.id)}>{params.id}</button></div>
            <div className='grid grid-cols-2 border-b-2 mb-4'></div>

            <div>
              <div className='grid grid-cols-2 mb-4'>
                <div>Total tx:</div>
                <div className='text-right'>{data.chain_stats.funded_txo_count + data.mempool_stats.funded_txo_count}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>Confirmed tx:</div>
                <div className='text-right'>{data.chain_stats.funded_txo_count}</div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div>Unconfirmed tx:</div>
                <div className='text-right'>{data.mempool_stats.funded_txo_count}</div>
              </div>
              <div className='grid grid-cols-2 border-b-2 mb-4'></div>

              <div className='grid grid-cols-2 mb-4'>
                <div>Confirmed Balance:</div>
                <div className='text-right'>{((data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
              </div>              
              <div className='grid grid-cols-2'>
                <div>Confirmed recieved:</div>
                <div className='text-right'>{(data.chain_stats.funded_txo_sum / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div>Confirmed spend:</div>
                <div className='text-right'>{(data.chain_stats.spent_txo_sum / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
              </div>
              <div className='grid grid-cols-2 border-b-2 mb-4'></div>
              
              <div className='grid grid-cols-2 mb-4'>
                <div>Unconfirmed Balance:</div>
                <div className='text-right'>{((data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum + data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum) / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>Unconfirmed recieved:</div>
                <div className='text-right'>{(data.mempool_stats.funded_txo_sum / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>Unconfirmed spend:</div>
                <div className='text-right'>{(data.mempool_stats.spent_txo_sum / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
              </div>
            </div>
          </div>
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