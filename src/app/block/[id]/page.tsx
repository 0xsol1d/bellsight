"use client";
import React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as dateFns from "date-fns";

import {
  Navbar,
  Footer,
  CopyIcon,
  Decimal,
  AlertComponent,
} from "../../../components";

export default function Block({ params }: { params: { id: any } }) {
  const alertRef = useRef<{ showAlert: (msg: string) => void }>(null);
  const [data, setData] = useState<any>();
  const [dataCoingecko, setDataCoingecko] = useState<any>();
  const [txs, setTxs] = useState<any>();
  const [height, setHeight] = useState<any>();
  const [method, setMethod] = useState<any>("");

  const GetHeight = async () => {
    await fetch("https://api.nintondo.io/api/blocks/tip/height")
      .then((res) => res.json())
      .then(async (result) => {
        setHeight(result);
      });
  };

  const GetBlockById = async (id: any) => {
    await fetch("https://api.nintondo.io/api/blocks/" + id)
      .then((res) => res.json())
      .then(async (result) => {
        setData(result[0]);
        await fetch(
          "https://api.nintondo.io/api/block/" + result[0].id + "/txs"
        )
          .then((res) => res.json())
          .then(async (result) => {
            setTxs(result);
          });
      });
  };

  const GetBlockByHash = async (id: any) => {
    await fetch("https://api.nintondo.io/api/block/" + id)
      .then((res) => res.json())
      .then(async (result) => {
        setData(result);
        await fetch("https://api.nintondo.io/api/block/" + result.id + "/txs")
          .then((res) => res.json())
          .then(async (result) => {
            setTxs(result);
          });
      });
  };

  const handleAlert = (message: string) => {
    alertRef.current?.showAlert(message);
  };

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);
    handleAlert("Copied block id");
  };

  function dec2Hex(dec: any) {
    return Math.abs(dec).toString(16);
  }

  const GetCoingeckoData = async () => {
    await fetch("https://api.coingecko.com/api/v3/coins/bellscoin")
      .then((res) => res.json())
      .then((result) => {
        setDataCoingecko(result);
      });
  };

  useEffect(() => {
    GetHeight();
    GetCoingeckoData();
    if (isNaN(params.id)) {
      setMethod("hash");
      GetBlockByHash(params.id);
    } else {
      setMethod("id");
      GetBlockById(params.id);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      {data && height && txs && (
        <div className="lg:grid grid-flow-row auto-rows-max place-content-center p-4">
          <h1 className="text-center lg:mt-0 mt-16 underline">BLOCK</h1>
          <div>
            <div className="flex justify-center mb-4">
              {method == "id" && (
                <button
                  className="text-blue-500 hover:text-blue-300 flex"
                  onClick={() => copyAddress(data.id)}
                >
                  <div className="break-all">{data.id}</div>
                  <CopyIcon />
                </button>
              )}
              {method == "hash" && (
                <button
                  className="text-blue-500 hover:text-blue-300 flex"
                  onClick={() => copyAddress(params.id)}
                >
                  <div className="break-all">{params.id}</div>
                  <CopyIcon />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 border-b-2 mb-4"></div>

            <div className="rounded-lg bg-base-300 p-2 mb-4">
              <div className="grid grid-cols-2">
                <div>Height:</div>
                <div className="text-right">{data.height}</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Confirmations:</div>
                <div className="text-right">{height - data.height + 1}</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Timestamp:</div>
                <div className="text-right">
                  {dateFns.format(
                    dateFns.fromUnixTime(data.timestamp),
                    "yyyy/MM/dd - HH:mm:ss"
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 mb-4">
                <div>Median Time:</div>
                <div className="text-right">
                  {dateFns.format(
                    dateFns.fromUnixTime(data.mediantime),
                    "yyyy/MM/dd - HH:mm:ss"
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 mb-4">
                <div>Previous blockhash:</div>
                <Link passHref href={`/block/${data.previousblockhash}`}>
                  <div className="flex text-right text-blue-500 hover:text-blue-300">
                    <div className=" truncate">{data.previousblockhash}</div>
                    <img src="/logo2.png" alt="tmp" className="h-6 ml-1" />
                  </div>
                </Link>
              </div>
              <div className="grid grid-cols-2 border-b-2 mb-4"></div>

              <div className="grid grid-cols-2">
                <div>TX count:</div>
                <div className="text-right">{data.tx_count}</div>
              </div>
              <div className="grid grid-cols-2 mb-4">
                <div>Difficulty:</div>
                <div className="text-right">{data.difficulty.toFixed(0)}</div>
              </div>
              <div className="grid grid-cols-2 border-b-2 mb-4"></div>

              <div className="grid grid-cols-2">
                <div>Weight:</div>
                <div className="text-right">{data.weight}</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Size:</div>
                <div className="text-right">{data.size} byte</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Bits:</div>
                <div className="text-right">
                  0x{dec2Hex(data.bits)} / {data.bits}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>Nonce:</div>
                <div className="text-right">
                  0x{dec2Hex(data.nonce)} / {data.nonce}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>Version:</div>
                <div className="text-right">
                  0x{dec2Hex(data.version)} / {data.version}
                </div>
              </div>
              <div className="grid grid-cols-2 mb-4">
                <div>Merkel Root:</div>
                <div className="text-right truncate">{data.merkle_root}</div>
              </div>
            </div>
          </div>

          {txs?.map((tx: any, index: any) => (
            <div
              key={index}
              className="lg:flex text-xs justify-between p-4 mb-6 rounded-lg bg-base-300 break-all"
            >
              <div className="grid place-content-center">
                {tx?.vin.map((data: any, index: any) => (
                  <>
                    {data.prevout != null && (
                      <Link
                        key={index}
                        passHref
                        href={`/tx/${tx.txid}`}
                        className=""
                      >
                        <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg hover:bg-base-100 p-4 w-full mb-1">
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
                        <div className="col-span-2 place-content-center gap-4 flex justify-between">
                          <div className="">{index}#</div>
                          <div className="text-right">COINBASE</div>
                        </div>
                      </div>
                    )}
                  </>
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
                {tx?.vout.map((tx: any, index: any) => (
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
          ))}
        </div>
      )}
      <div className="mb-24"></div>
      <Footer />
      <AlertComponent ref={alertRef} />
    </div>
  );
}
