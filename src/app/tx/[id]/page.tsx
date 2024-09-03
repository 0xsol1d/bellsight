"use client";
import React, { use } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { toastStyles } from "../../../utils/styles";

import { Navbar, CopyIcon, Decimal, Loader } from "../../../components";

export default function Tx({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>();
  const [dataCoingecko, setDataCoingecko] = useState<any>();
  const [height, setHeight] = useState<any>();
  const [error, setError] = useState<boolean>(false);

  const GetHeight = async () => {
    await fetch("https://api.nintondo.io/api/blocks/tip/height")
      .then((res) => res.json())
      .then(async (result) => {
        setHeight(result);
      });
  };

  const GetTransaction = async (id: any) => {
    await fetch("https://api.nintondo.io/api/tx/" + id)
      .then((res) => res.json())
      .then((result) => {
        if (result)
          setData(result);
        else {
          toast.error("Tx not found", toastStyles);
          setError(true);
        }
      });
  };

  const GetCoingeckoData = async () => {
    await fetch("https://api.coingecko.com/api/v3/coins/bellscoin")
      .then((res) => res.json())
      .then((result) => {
        setDataCoingecko(result);
      });
  };

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);

    toast.success("Copied tx id", toastStyles);
  };

  useEffect(() => {
    GetHeight();
    GetTransaction(params.id);
    GetCoingeckoData();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="">
        {data && height && dataCoingecko ? (
          <div className="lg:grid grid-flow-row auto-rows-max place-content-center p-2">
            <h1 className="text-center lg:mt-0 mt-2 underline">TX</h1>
            <div>
              <div className="flex justify-center mb-4">
                <button
                  className="text-blue-500 hover:text-blue-300 flex"
                  onClick={() => copyAddress(params.id)}
                >
                  <div className="break-all">{params.id}</div>
                  <CopyIcon />
                </button>
              </div>
              <div className="grid grid-cols-2 border-b-2 mb-4"></div>

              <div className="rounded-lg bg-base-300 p-2 mb-4">
                <div className="grid grid-cols-2 mb-4">
                  <div>Confirmations:</div>
                  {data.status.confirmed.toString() == "false" && (
                    <div className="text-right">not confirmed</div>
                  )}
                  {data.status.confirmed.toString() == "true" && (
                    <div className="text-right">
                      {height - data.status.block_height + 1}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 border-b-2 mb-4"></div>

                <div className="grid grid-cols-2">
                  <div>Block Height:</div>
                  {data.status.confirmed.toString() == "false" && (
                    <div className="text-right">not included</div>
                  )}
                  {data.status.confirmed.toString() == "true" && (
                    <div className="text-right">{data.status.block_height}</div>
                  )}
                </div>
                <div className="grid grid-cols-2 mb-4">
                  <div>Block Hash:</div>
                  {data.status.confirmed.toString() == "false" && (
                    <div className="text-right truncate">not included</div>
                  )}
                  {data.status.confirmed.toString() == "true" && (
                    <Link passHref href={`/block/${data.status.block_hash}`}>
                      <div className="text-right text-blue-500 hover:text-blue-300 flex">
                        <div className="truncate">{data.status.block_hash}</div>
                        <img src="/logo2.png" alt="tmp" className="h-6 ml-1" />
                      </div>
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-2 border-b-2 mb-4"></div>

                <div className="grid grid-cols-2">
                  <div>Fee:</div>
                  <div className="text-right">
                    {(data.fee / 100000000).toLocaleString(undefined, {
                      minimumFractionDigits: 8,
                    })}{" "}
                    $BEL
                    {` (${(
                      (data.fee / 100000000) *
                      dataCoingecko.market_data.current_price.usd
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                    })}$)`}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>Size:</div>
                  <div className="text-right">{data.size} byte</div>
                </div>
                <div className="grid grid-cols-2">
                  <div>Weight:</div>
                  <div className="text-right">{data.weight}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div>Version:</div>
                  <div className="text-right">{data.version}</div>
                </div>
                <div className="grid grid-cols-2 mb-4">
                  <div>Locktime:</div>
                  <div className="text-right">{data.locktime}</div>
                </div>
                <div className="grid grid-cols-2 border-b-2 mb-4"></div>
              </div>
            </div>
            <div className="text-xs p-4 mb-16 rounded-lg bg-base-300">
              <Link
                passHref
                href={`/tx/${data.txid}`}
                className="truncate flex"
              >
                <div className="text-blue-500 mb-4 break-words truncate rounded hover:text-blue-300">
                  {data.txid}
                </div>
                <img src="/logo2.png" alt="tmp" className="h-4 ml-1" />
              </Link>
              <div className="lg:flex justify-between">
                <div className="grid place-content-center">
                  {data?.vin.map((data: any, index: any) => (
                    <div key={index}>
                      {data.prevout != null && (
                        <Link key={index} passHref href={`/tx/${data.txid}`}>
                          <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg hover:bg-base-100 p-4 w-full break-all mb-1">
                            <div className="col-span-2 place-content-center gap-4 flex justify-between">
                              <div className="">{index}#</div>
                              <div className="text-left text-blue-500">
                                {data.txid}
                              </div>
                            </div>
                            <div className="col-span-1 text-right place-content-center flex justify-end">
                              <Decimal
                                number={data.prevout.value / 100000000}
                                dec={8}
                              />
                              &nbsp;$BEL
                              {` (${(
                                (data.prevout.value / 100000000) *
                                dataCoingecko.market_data.current_price.usd
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                              })}$)`}
                            </div>
                          </div>
                        </Link>
                      )}
                      {data.prevout == null && (
                        <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg p-4 w-full">
                          <div className="col-span-1 place-content-center truncate gap-4 flex justify-between">
                            <div className="">{index}#</div>
                            <div className="text-right">COINBASE</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <br className="block lg:hidden" />
                <div className="lg:grid place-content-center text-3xl hidden">
                  🠺
                </div>
                <div className="grid place-content-center text-3xl lg:hidden">
                  🠻
                </div>
                <br className="block lg:hidden" />
                <div className="grid place-content-center">
                  {data?.vout.map((tx: any, index: any) => (
                    <Link
                      key={index}
                      passHref
                      href={`/address/${tx.scriptpubkey_address}`}
                    >
                      <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg hover:bg-base-100 p-4 mb-1">
                        {tx.scriptpubkey_type == "op_return" && (
                          <>
                            <div className="col-span-3 truncate gap-4 flex">
                              <div className="">{index}#</div>
                              <div className="text-left">OP_RETURN</div>
                            </div>
                          </>
                        )}
                        {tx.scriptpubkey_type != "op_return" && (
                          <>
                            <div className="col-span-2 truncate gap-4 flex">
                              <div className="">{index}#</div>
                              <div className="text-left text-blue-500">
                                {tx.scriptpubkey_address}
                              </div>
                            </div>
                            <div className="col-span-1 text-right place-content-center flex justify-end">
                              <Decimal number={tx.value / 100000000} dec={8} />
                              &nbsp;$BEL
                              {` (${(
                                (tx.value / 100000000) *
                                dataCoingecko.market_data.current_price.usd
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                              })}$)`}
                            </div>
                          </>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="lg:mt-96 mt-40 flex flex-col justify-center items-center text-center">
            TX not found
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
