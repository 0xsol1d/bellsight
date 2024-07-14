'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as dateFns from "date-fns"

import { Navbar, Footer } from "../../../components"

export default function Block({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>()
  const [blocks, setBlocks] = useState<any>()
  const [message, setMessage] = useState<any>("")

  const GetBlocks = async () => {
    await fetch('https://api.nintondo.io/api/blocks')
      .then((res) => res.json())
      .then(async (result) => {
        setBlocks(result)
      })
  }

  const GetBlock = async (id: any) => {
    await fetch('https://api.nintondo.io/api/block/' + id)
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setData(result)
      })
  }

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);
    showAlert("Copied block id!")
  }

  function dec2Hex(dec: any) {
    return Math.abs(dec).toString(16);
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
    GetBlock(params.id)
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />
      {data && blocks &&
        <div className="grid grid-flow-row auto-rows-max place-content-center">
          <h1 className="text-center mt-2">BLOCK</h1>
          <br />
          <div>
            <div className='flex justify-center mb-4'> <button className='hover:text-blue-500' onClick={() => copyAddress(params.id)}>{params.id}</button></div>
            <div className='grid grid-cols-2 border-b-2 mb-4'></div>

            <div>
              <div className='grid grid-cols-2'>
                <div>Height:</div>
                <div className='text-right'>{data.height}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>Confirmations:</div>
                <div className='text-right'>{blocks[0].height - data.height + 1}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>Timestamp:</div>
                <div className='text-right'>{dateFns.format(dateFns.fromUnixTime(data.timestamp), "yyyy/MM/dd - HH:mm:ss")}</div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div>Median Time:</div>
                <div className='text-right'>{dateFns.format(dateFns.fromUnixTime(data.mediantime), "yyyy/MM/dd - HH:mm:ss")}</div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div>Previous blockhash:</div>
                <Link passHref href={`/block/${data.previousblockhash}`}>
                  <div className='text-right hover:text-blue-500 truncate'>{data.previousblockhash}</div>
                </Link>
              </div>
              <div className='grid grid-cols-2 border-b-2 mb-4'></div>

              <div className='grid grid-cols-2'>
                <div>TX count:</div>
                <div className='text-right'>{data.tx_count}</div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div>Difficulty:</div>
                <div className='text-right'>{data.difficulty.toFixed(0)}</div>
              </div>
              <div className='grid grid-cols-2 border-b-2 mb-4'></div>

              <div className='grid grid-cols-2'>
                <div>Weight:</div>
                <div className='text-right'>{data.weight}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>Size:</div>
                <div className='text-right'>{data.size}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>Bits:</div>
                <div className='text-right'>0x{dec2Hex(data.bits)} / {data.bits}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>Nonce:</div>
                <div className='text-right'>0x{dec2Hex(data.nonce)} / {data.nonce}</div>
              </div>
              <div className='grid grid-cols-2'>
                <div>Version:</div>
                <div className='text-right'>0x{dec2Hex(data.version)} / {data.version}</div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div>Merkel Root:</div>
                <div className='text-right truncate'>{data.merkle_root}</div>
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