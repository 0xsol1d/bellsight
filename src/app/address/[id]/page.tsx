'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

import { Navbar, Footer } from "../../../components"

export default function Block({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>()
  const [txs, setTxs] = useState<any>()
  const [message, setMessage] = useState<any>("")
  const [isAtBottom, setIsAtBottom] = useState(false);

  const GetAddress = async (addr: any) => {
    await fetch('https://api.nintondo.io/api/address/' + addr)
      .then((res) => res.json())
      .then(async (result) => {
        setData(result)
        await fetch('https://api.nintondo.io/api/address/' + addr + '/txs')
          .then((res) => res.json())
          .then(async (result) => {
            console.log(result[result.length - 1].txid)
            setTxs(result)
          })
      })
  }

  const GetNextTxs = async (addr: any) => {
    await fetch('https://api.nintondo.io/api/address/' + addr + '/txs/chain/' + txs[txs.length - 1].txid)
      .then((res) => res.json())
      .then((result) => {
        result.forEach((element: any) => {
          setTxs((state: any) => [...state, element])
        });
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
    const handleScroll = () => {
      const position = window.scrollY;
      const isBottom = window.innerHeight + position >= document.documentElement.scrollHeight - 200;
      setIsAtBottom(isBottom);
    };

    // Scroll-Event-Listener hinzufügen
    window.addEventListener('scroll', handleScroll);

    // Aufräumen des Event-Listeners beim Unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAtBottom)
      GetNextTxs(params.id)
  }, [isAtBottom]);

  return (

    <div className="min-h-screen">
      <Navbar />
      <div className=''>
        {data && txs &&
          <div className="lg:grid grid-flow-row auto-rows-max place-content-center p-2">
            <h1 className="text-center lg:mt-0 mt-16 underline">ADDRESS</h1>
            <div>
              <div className='flex justify-center mb-4'> <button className='hover:text-blue-500 truncate' onClick={() => copyAddress(params.id)}>{params.id}</button></div>
              <div className='grid grid-cols-2 border-b-2 mb-4'></div>

              <div className='rounded-lg bg-base-300 p-2 mb-4'>
                <div className='grid grid-cols-2 mb-4'>
                  <div>Total tx:</div>
                  <div className='text-right'>{data.chain_stats.tx_count}</div>
                </div>
                <div className='grid grid-cols-2'>
                  <div>Confirmed recieved:</div>
                  <div className='text-right'>{data.chain_stats.funded_txo_count}</div>
                </div>
                <div className='grid grid-cols-2'>
                  <div>Confirmed spent:</div>
                  <div className='text-right'>{data.chain_stats.spent_txo_count}</div>
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

                {data.mempool_stats.funded_txo_sum != 0 &&
                  <div className='grid grid-cols-2 mb-4'>
                    <div>Unconfirmed Balance:</div>
                    <div className='text-right'>{((data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum + data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum) / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
                  </div>
                }
                {data.mempool_stats.funded_txo_sum == 0 &&
                  <div className='grid grid-cols-2 mb-4'>
                    <div>Unconfirmed Balance:</div>
                    <div className='text-right'>0 $BEL</div>
                  </div>
                }
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
            {txs?.map((tx: any, index: any) => (
              <div key={index} className='text-xs p-4 mb-6 rounded-lg bg-base-300 break-all'>
                <Link key={index} passHref href={`/tx/${tx.txid}`} className='truncate'><div className='text-blue-500 mb-2 break-words truncate'>{tx.txid}</div></Link>
                <div className='lg:flex justify-between'>
                  <div className='grid place-content-center'>
                    {tx?.vin.map((data: any, index: any) => (
                      <>
                        {data.prevout != null &&
                          <Link key={index} passHref href={`/tx/${tx.txid}`}>
                            <div className="lg:grid lg:grid-cols-3 bg-base-200 rounded-lg hover:bg-gray-900 p-4 w-full">
                              <div className="col-span-2 place-content-center gap-4 flex justify-between"><div className=''>{index}#</div><div className='text-left text-blue-500'>{data.txid}</div></div>
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
                    {tx?.vout.map((tx: any, index: any) => (
                      <Link key={index} passHref href={`/address/${tx.scriptpubkey_address}`}>
                        <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg hover:bg-gray-900 p-4 mb-1">
                          {tx.scriptpubkey_type == "op_return" &&
                            <>
                              <div className="col-span-3 truncate gap-4 flex"><div className=''>{index}#</div><div className='text-left'>OP_RETURN</div></div>
                            </>
                          }
                          {tx.scriptpubkey_type != "op_return" &&
                            <>
                              <div className="col-span-2 truncate gap-4 flex"><div className=''>{index}#</div><div className='text-left text-blue-500 truncate'>{tx.scriptpubkey_address}</div></div>
                              <div className="col-span-1 text-right truncate place-content-center">{(tx.value / 100000000).toLocaleString(undefined, { minimumFractionDigits: 8 })} $BEL</div>
                            </>
                          }
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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