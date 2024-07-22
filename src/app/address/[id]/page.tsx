'use client'
import React from 'react';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

import { Navbar, Footer, CopyIcon, Decimal, AlertComponent } from "../../../components"

export default function Address({ params }: { params: { id: string } }) {
  const alertRef = useRef<{ showAlert: (msg: string) => void }>(null);
  const [data, setData] = useState<any>()
  const [txs, setTxs] = useState<any>()
  const [isAtBottom, setIsAtBottom] = useState(false);

  const GetAddress = async (addr: any) => {
    await fetch('https://api.nintondo.io/api/address/' + addr)
      .then((res) => res.json())
      .then(async (result) => {
        setData(result)
        if (result.chain_stats.funded_txo_count > 0)
          await fetch('https://api.nintondo.io/api/address/' + addr + '/txs')
            .then((res) => res.json())
            .then(async (result) => {
              setTxs(result)
            })
        else            
          setTxs([])
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
    handleAlert("Copied address")
  }

  const handleAlert = (message: string) => {
    alertRef.current?.showAlert(message);
  };

  useEffect(() => {
    GetAddress(params.id)

    const handleScroll = () => {
      const position = window.scrollY;
      const isBottom = window.innerHeight + position >= document.documentElement.scrollHeight - 200;
      setIsAtBottom(isBottom);
    };
    window.addEventListener('scroll', handleScroll);
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
              <div className='flex justify-center mb-4'>
                <button className='text-blue-500 hover:text-blue-300 flex' onClick={() => copyAddress(params.id)}>
                  <div className='break-all'>{params.id}</div>
                  <CopyIcon />
                </button>
              </div>
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
                  <div className='text-right flex justify-end'><Decimal number={(data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000} dec={8}/>&nbsp;$BEL</div>
                </div>
                <div className='grid grid-cols-2'>
                  <div>Confirmed recieved:</div>
                  <div className='text-right flex justify-end'><Decimal number={data.chain_stats.funded_txo_sum / 100000000} dec={8}/>&nbsp;$BEL</div>
                </div>
                <div className='grid grid-cols-2 mb-4'>
                  <div>Confirmed spend:</div>
                  <div className='text-right flex justify-end'><Decimal number={data.chain_stats.spent_txo_sum / 100000000} dec={8}/>&nbsp;$BEL</div>
                </div>
                <div className='grid grid-cols-2 border-b-2 mb-4'></div>

                {data.mempool_stats.funded_txo_sum != 0 &&
                  <div className='grid grid-cols-2 mb-4'>
                    <div>Unconfirmed Balance:</div>
                    <div className='text-right flex justify-end'><Decimal number={(data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum + data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum) / 100000000} dec={8}/>&nbsp;$BEL</div>
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
                  <div className='text-right flex justify-end'><Decimal number={data.mempool_stats.funded_txo_sum / 100000000} dec={8}/>&nbsp;$BEL</div>
                </div>
                <div className='grid grid-cols-2'>
                  <div>Unconfirmed spend:</div>
                  <div className='text-right flex justify-end'><Decimal number={data.mempool_stats.spent_txo_sum / 100000000} dec={8}/>&nbsp;$BEL</div>
                </div>
              </div>
            </div>
            {data.chain_stats.tx_count > 0 &&
              <>
                {txs?.map((tx: any, index: any) => (
                  <div key={index} className='text-xs p-4 mb-16 rounded-lg bg-base-300 break-all'>
                    <Link key={index} passHref href={`/tx/${tx.txid}`} className='truncate flex'><div className='text-blue-500 mb-4 break-words truncate rounded hover:text-blue-300'>{tx.txid}</div><img src="/logo2.png" alt="tmp" className='h-4 ml-1' /></Link>
                    <div className='lg:flex justify-between'>
                      <div className='grid place-content-center'>
                        {tx?.vin.map((data: any, index: any) => (
                          <>
                            {data.prevout != null &&
                              <Link key={index} passHref href={`/tx/${tx.txid}`}>
                                <div className="lg:grid lg:grid-cols-3 bg-base-200 rounded-lg hover:bg-gray-900 p-4 w-full mb-1">
                                  <div className="col-span-2 place-content-center gap-4 flex justify-between"><div className=''>{index}#</div><div className='text-left text-blue-500'>{data.txid}</div></div>
                                  <div className="col-span-1 text-right place-content-center flex justify-end"><Decimal number={data.prevout.value / 100000000} dec={8}/>&nbsp;$BEL</div>
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
                                  <div className="col-span-1 text-right place-content-center flex justify-end"><Decimal number={tx.value / 100000000} dec={8}/>&nbsp;$BEL</div>
                                </>
                              }
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            }
          </div>
        }
      </div>
      <Footer />
      <AlertComponent ref={alertRef} />
    </div>
  )
}