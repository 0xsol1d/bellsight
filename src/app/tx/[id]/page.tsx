'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Navbar, Footer } from "../../../components"

export default function Tx({ params }: { params: { id: string } }) {
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

  const GetTransaction = async (id: any) => {
    await fetch('https://api.nintondo.io/api/tx/' + id)
      .then((res) => res.json())
      .then((result) => {
        setData(result)
      })
  }

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);
    showAlert("Copied tx id!")
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
    GetTransaction(params.id)
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      <div className=''>
        {data && blocks &&
          <div className="lg:grid grid-flow-row auto-rows-max place-content-center p-2">
            <h1 className="text-center lg:mt-0 mt-16">TX</h1>
            <br />
            <div>
              <div className='flex justify-center mb-4'> <button className='hover:text-blue-500 truncate' onClick={() => copyAddress(params.id)}>{params.id}</button></div>
              <div className='grid grid-cols-2 border-b-2 mb-4'></div>

              <div>
                <div className='grid grid-cols-2 mb-4'>
                  <div>Confirmations:</div>
                  {data.status.confirmed.toString() == "false" &&
                    <div className='text-right'>not confirmed</div>
                  }
                  {data.status.confirmed.toString() == "true" &&
                    <div className='text-right'>{blocks[0].height - data.status.block_height + 1}</div>
                  }
                </div>
                <div className='grid grid-cols-2 border-b-2 mb-4'></div>

                <div className='grid grid-cols-2'>
                  <div>Block Height:</div>
                  {data.status.confirmed.toString() == "false" &&
                    <div className='text-right'>not included</div>
                  }
                  {data.status.confirmed.toString() == "true" &&
                    <div className='text-right'>{data.status.block_height}</div>
                  }
                </div>
                <div className='grid grid-cols-2 mb-4'>
                  <div>Block Hash:</div>
                  {data.status.confirmed.toString() == "false" &&
                    <div className='text-right truncate'>not included</div>
                  }
                  {data.status.confirmed.toString() == "true" &&
                    <div className='text-right truncate'>{data.status.block_hash}</div>
                  }
                </div>
                <div className='grid grid-cols-2 border-b-2 mb-4'></div>

                <div className='grid grid-cols-2'>
                  <div>Fee:</div>
                  <div className='text-right'>{(data.fee / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
                </div>
                <div className='grid grid-cols-2'>
                  <div>Size:</div>
                  <div className='text-right'>{data.size} byte</div>
                </div>
                <div className='grid grid-cols-2'>
                  <div>Weight:</div>
                  <div className='text-right'>{data.weight}</div>
                </div>
                <div className='grid grid-cols-2'>
                  <div>Version:</div>
                  <div className='text-right'>{data.version}</div>
                </div>
                <div className='grid grid-cols-2 mb-4'>
                  <div>Locktime:</div>
                  <div className='text-right'>{data.locktime}</div>
                </div>
                <div className='grid grid-cols-2 border-b-2 mb-4'></div>

              </div>
            </div>
          </div>
        }
        <div className='lg:flex text-xs justify-between p-4 mb-16'>
          <div className='grid place-content-center'>
            <div className='text-center'>INPUTS</div>
            {data?.vin.map((tx: any, index: any) => (
              <Link passHref href={`/tx/${tx.txid}`}>
                <div key={index} className="lg:grid grid-cols-3 border-2 hover:bg-gray-900 p-2">
                  <div className="col-span-2 place-content-center truncate">{tx.txid}</div>
                  <div className="col-span-1 text-right truncate place-content-center">{(tx.prevout.value / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
                </div>
              </Link>
            ))}
          </div>
          <br className='block lg:hidden' />
          <div className='grid place-content-center'>{`===>`}</div>
          <br className='block lg:hidden' />
          <div className='grid place-content-center'>
            <div className='text-center'>OUTPUTS</div>
            {data?.vout.map((tx: any, index: any) => (
              <Link passHref href={`/address/${tx.scriptpubkey_address}`}>
                <div key={index} className="lg:grid grid-cols-3 border-2 hover:bg-gray-900 p-2">
                  <div className="col-span-2 place-content-center truncate">{tx.scriptpubkey_address}</div>
                  <div className="col-span-1 text-right truncate place-content-center">{(tx.value / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
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