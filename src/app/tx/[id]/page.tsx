'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Navbar, Footer } from "../../../components"

export default function Tx({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>()
  const [height, setHeight] = useState<any>()
  const [message, setMessage] = useState<any>("")

  const GetHeight = async () => {
    await fetch('https://api.nintondo.io/api/blocks/tip/height')
      .then((res) => res.json())
      .then(async (result) => {
        setHeight(result)
      })
  }

  const GetTransaction = async (id: any) => {
    await fetch('https://api.nintondo.io/api/tx/' + id)
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
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
    GetHeight()
    GetTransaction(params.id)
  }, []);

  return (

    <div className="min-h-screen">
      <Navbar />

      <div className=''>
        {data && height &&
          <div className="lg:grid grid-flow-row auto-rows-max place-content-center p-2">
            <h1 className="text-center lg:mt-0 mt-16">TX</h1>
            <div>
              <div className='flex justify-center mb-4'>
                <button className='text-blue-500 truncate' onClick={() => copyAddress(params.id)}>{params.id}</button>
              </div>
              <div className='grid grid-cols-2 border-b-2 mb-4'></div>

              <div className='rounded-lg bg-base-300 p-2 mb-4'>
                <div className='grid grid-cols-2 mb-4'>
                  <div>Confirmations:</div>
                  {data.status.confirmed.toString() == "false" &&
                    <div className='text-right'>not confirmed</div>
                  }
                  {data.status.confirmed.toString() == "true" &&
                    <div className='text-right'>{height - data.status.block_height + 1}</div>
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
                    <Link passHref href={`/block/${data.status.block_hash}`}>
                      <div className='text-right text-blue-500 truncate'>{data.status.block_hash}</div>
                    </Link>
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
            <div className='text-xs p-4 mb-6 rounded-lg bg-base-300'>
              <div className='lg:flex justify-between'>
                <div className='grid place-content-center'>
                  {data?.vin.map((data: any, index: any) => (
                    <>
                      {data.prevout != null &&
                        <Link key={index} passHref href={`/tx/${data.txid}`}>
                          <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg hover:bg-gray-900 p-4 w-full">
                            <div className="col-span-2 place-content-center truncate gap-4 flex justify-between"><div className=''>{index}#</div><div className='text-left text-blue-500'>{data.txid}</div></div>
                            <div className="col-span-1 text-right truncate place-content-center">{(data.prevout.value / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
                          </div>
                        </Link>
                      }
                      {data.prevout == null &&
                        <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg p-4 w-full">
                          <div className="col-span-2 place-content-center truncate gap-4 flex justify-between"><div className=''>{index}#</div><div className='text-right'>COINBASE</div></div>
                        </div>
                      }
                    </>
                  ))}
                </div>
                <br className='block lg:hidden' />
                <div className='lg:grid place-content-center text-3xl hidden'>🠺</div>
                <div className='grid place-content-center text-3xl lg:hidden'>🠻</div>
                <br className='block lg:hidden' />
                <div className='grid place-content-center'>
                  {data?.vout.map((tx: any, index: any) => (
                    <Link key={index} passHref href={`/address/${tx.scriptpubkey_address}`}>
                      <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg hover:bg-gray-900 p-4 mb-1">
                        {tx.scriptpubkey_type == "op_return" &&
                          <>
                            <div className="col-span-3 truncate gap-4 flex"><div className=''>{index}#</div><div className='text-left'>OP_RETURN</div></div>
                          </>
                        }
                        {tx.scriptpubkey_type != "op_return" &&
                          <>
                            <div className="col-span-2 truncate gap-4 flex"><div className=''>{index}#</div><div className='text-left text-blue-500'>{tx.scriptpubkey_address}</div></div>
                            <div className="col-span-1 text-right truncate place-content-center">{(tx.value / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
                          </>
                        }
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
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